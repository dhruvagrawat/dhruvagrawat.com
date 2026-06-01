import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const maxDuration = 30

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function checkService(url: string): Promise<{
  status: "up" | "degraded" | "down"
  responseTimeMs: number | null
  statusCode: number | null
  errorMessage: string | null
}> {
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    })
    const responseTimeMs = Date.now() - start

    // 2xx and 3xx = up, 4xx = degraded, 5xx = down
    const status: "up" | "degraded" | "down" =
      res.status < 400 ? "up" : res.status >= 500 ? "down" : "degraded"

    // Try to read incident info if the endpoint returns JSON
    // Expected shape: { incident?: string, message?: string, status?: string }
    let errorMessage: string | null = null
    const contentType = res.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) {
      try {
        const json = await res.clone().json()
        const incident = json?.incident ?? json?.message ?? json?.error ?? null
        if (incident && typeof incident === "string") errorMessage = incident
      } catch { /* not valid JSON — ignore */ }
    }

    return { status, responseTimeMs, statusCode: res.status, errorMessage }
  } catch (err) {
    const responseTimeMs = Date.now() - start
    return {
      status: "down",
      responseTimeMs,
      statusCode: null,
      errorMessage: err instanceof Error ? err.message : "Unknown error",
    }
  }
}

// POST /api/status/check  — triggered by Vercel Cron or manually
// Optional body: { serviceId: string }  to check a single service
export async function POST(req: NextRequest) {
  // Basic auth via cron secret to prevent public abuse
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabase()

  let query = supabase.from("status_services").select("*").eq("active", true)

  try {
    const body = await req.json().catch(() => ({}))
    if (body?.serviceId) query = query.eq("id", body.serviceId)
  } catch {
    // no body — check all
  }

  const { data: services, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!services || services.length === 0)
    return NextResponse.json({ checked: 0 })

  const results = await Promise.all(
    services.map(async (svc) => {
      const result = await checkService(svc.url)
      const { error: insertError } = await supabase.from("status_checks").insert({
        service_id: svc.id,
        status: result.status,
        response_time_ms: result.responseTimeMs,
        status_code: result.statusCode,
        error_message: result.errorMessage,
      })
      return { name: svc.name, ...result, insertError: insertError?.message ?? null }
    })
  )

  return NextResponse.json({ checked: results.length, results })
}

// GET /api/status/check  — convenience manual trigger (no auth, just runs)
export async function GET() {
  const supabase = getSupabase()
  const { data: services } = await supabase
    .from("status_services")
    .select("*")
    .eq("active", true)

  if (!services?.length) return NextResponse.json({ checked: 0 })

  const results = await Promise.all(
    services.map(async (svc) => {
      const result = await checkService(svc.url)
      await supabase.from("status_checks").insert({
        service_id: svc.id,
        status: result.status,
        response_time_ms: result.responseTimeMs,
        status_code: result.statusCode,
        error_message: result.errorMessage,
      })
      return { name: svc.name, ...result }
    })
  )

  return NextResponse.json({ checked: results.length, results })
}
