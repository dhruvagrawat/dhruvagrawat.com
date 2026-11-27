import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { fallbackServices } from "@/content/status-services"

export type CheckStatus = "up" | "degraded" | "down"

export interface CheckResult {
  status: CheckStatus
  responseTimeMs: number | null
  statusCode: number | null
  errorMessage: string | null
}

/** How old the newest check may be before a page view triggers a fresh round. */
export const STALE_AFTER_MS = 5 * 60 * 1000

export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

/** Service-role client when available (can write checks), otherwise the anon client (read-only). */
export function getStatusClient(): { client: SupabaseClient; canWrite: boolean } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceKey) return { client: createClient(url, serviceKey), canWrite: true }
  return { client: createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!), canWrite: false }
}

/** Server-side password for the private "client services" section. */
export function privatePassword() {
  return process.env.STATUS_PRIVATE_PASSWORD || process.env.NEXT_PUBLIC_STATUS_PRIVATE_PASSWORD || ""
}

export async function checkService(url: string, timeoutMs = 10_000): Promise<CheckResult> {
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
      headers: { "user-agent": "dhruvagrawat.com status monitor" },
    })
    const responseTimeMs = Date.now() - start

    // 2xx/3xx = up, 4xx = degraded, 5xx = down. Very slow responses count as degraded.
    let status: CheckStatus = res.status < 400 ? "up" : res.status >= 500 ? "down" : "degraded"
    if (status === "up" && responseTimeMs > 5_000) status = "degraded"

    // If the endpoint returns JSON like { incident | message | error }, surface it.
    let errorMessage: string | null = null
    if ((res.headers.get("content-type") ?? "").includes("application/json")) {
      try {
        const json = await res.clone().json()
        const incident = json?.incident ?? json?.message ?? json?.error ?? null
        if (incident && typeof incident === "string" && status !== "up") errorMessage = incident
      } catch {
        /* not valid JSON */
      }
    }
    if (status !== "up" && !errorMessage) {
      errorMessage = status === "degraded" && res.status < 400 ? `Slow response (${responseTimeMs} ms)` : `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ""}`
    }
    return { status, responseTimeMs, statusCode: res.status, errorMessage }
  } catch (err) {
    return { status: "down", responseTimeMs: Date.now() - start, statusCode: null, errorMessage: describeFetchError(err, timeoutMs) }
  }
}

/** Turn Node's vague "fetch failed" into something a person can act on. */
export function describeFetchError(err: unknown, timeoutMs = 10_000): string {
  if (!(err instanceof Error)) return "Unknown error"
  if (err.name === "TimeoutError" || err.name === "AbortError") return `No response within ${timeoutMs / 1000}s`
  const cause = (err as Error & { cause?: { code?: string; message?: string } }).cause
  const code = cause?.code ?? ""
  const known: Record<string, string> = {
    ENOTFOUND: "Domain doesn't resolve (DNS record missing or expired)",
    EAI_AGAIN: "DNS lookup failed (temporary)",
    ECONNREFUSED: "Server refused the connection (nothing listening)",
    ECONNRESET: "Connection was reset by the server",
    ETIMEDOUT: "Connection timed out",
    EHOSTUNREACH: "Server is unreachable",
    UND_ERR_CONNECT_TIMEOUT: "Connection timed out",
    CERT_HAS_EXPIRED: "SSL certificate has expired",
    ERR_TLS_CERT_ALTNAME_INVALID: "SSL certificate doesn't match this domain",
    DEPTH_ZERO_SELF_SIGNED_CERT: "Self-signed SSL certificate",
    UNABLE_TO_VERIFY_LEAF_SIGNATURE: "SSL certificate can't be verified",
  }
  if (known[code]) return `${known[code]} [${code}]`
  if (code) return `${cause?.message ?? err.message} [${code}]`
  return cause?.message ?? err.message
}

/** Checks every given service in parallel and stores the results. */
export async function runChecks(
  client: SupabaseClient,
  services: { id: string; name: string; url: string }[]
) {
  return Promise.all(
    services.map(async (svc) => {
      const result = await checkService(svc.url)
      const { error } = await client.from("status_checks").insert({
        service_id: svc.id,
        status: result.status,
        response_time_ms: result.responseTimeMs,
        status_code: result.statusCode,
        error_message: result.errorMessage,
      })
      return { name: svc.name, ...result, insertError: error?.message ?? null }
    })
  )
}

/* ── Live mode: used when Supabase is missing or unreachable ───────────────── */


let liveCache: { at: number; data: unknown[] } | null = null

/** Checks the backup service list right now (cached for a minute), in the same shape as the database mode. */
export async function liveSnapshot() {
  if (liveCache && Date.now() - liveCache.at < 60_000) return liveCache.data
  const checkedAt = new Date().toISOString()
  const data = await Promise.all(
    fallbackServices.map(async (svc) => {
      const r = await checkService(svc.url)
      const entry = {
        status: r.status,
        response_time_ms: r.responseTimeMs,
        status_code: r.statusCode,
        error_message: r.errorMessage,
        checked_at: checkedAt,
      }
      return {
        id: svc.url,
        name: svc.name,
        url: svc.url,
        group_name: svc.group,
        description: svc.description ?? null,
        is_private: false,
        type: svc.type ?? "website",
        latest: entry,
        history: [entry],
        uptimePct: null,
      }
    })
  )
  liveCache = { at: Date.now(), data }
  return data
}
