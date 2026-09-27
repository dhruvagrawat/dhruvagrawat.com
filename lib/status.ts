import { createClient, type SupabaseClient } from "@supabase/supabase-js"

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
    return { status, responseTimeMs, statusCode: res.status, errorMessage }
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")
    return {
      status: "down",
      responseTimeMs: Date.now() - start,
      statusCode: null,
      errorMessage: timedOut ? `No response within ${timeoutMs / 1000}s` : err instanceof Error ? err.message : "Unknown error",
    }
  }
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
