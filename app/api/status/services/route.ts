import { NextRequest, NextResponse } from "next/server"
import {
  STALE_AFTER_MS,
  getStatusClient,
  hasSupabaseEnv,
  privatePassword,
  runChecks,
} from "@/lib/status"

export const dynamic = "force-dynamic"
export const maxDuration = 30

const HISTORY = 90

// GET /api/status/services
// Returns public services (and private ones when the `x-status-password` header is correct),
// each with its latest check, the last 90 checks oldest → newest, and uptime %.
// If the newest check is older than 5 minutes, a fresh round of checks runs first, so the
// page stays live even without a frequent cron job.
export async function GET(req: NextRequest) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Status monitoring isn't configured: Supabase environment variables are missing." },
      { status: 503 }
    )
  }

  const { client, canWrite } = getStatusClient()

  const { data: all, error } = await client
    .from("status_services")
    .select("id, name, url, group_name, description, is_private, type")
    .eq("active", true)
    .order("group_name")
    .order("name")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const services = all ?? []
  const pw = privatePassword()
  const provided = req.headers.get("x-status-password") ?? ""
  const privateUnlocked = Boolean(pw) && provided === pw
  const privateCount = services.filter((s) => s.is_private).length
  const visible = services.filter((s) => !s.is_private || privateUnlocked)

  // Refresh when stale — only possible with the service-role key.
  let checkedNow = false
  if (canWrite && services.length) {
    const { data: newest } = await client
      .from("status_checks")
      .select("checked_at")
      .order("checked_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    const age = newest ? Date.now() - new Date(newest.checked_at).getTime() : Infinity
    if (age > STALE_AFTER_MS) {
      await runChecks(client, services)
      checkedNow = true
    }
  }

  const enriched = await Promise.all(
    visible.map(async (svc) => {
      const { data: checks } = await client
        .from("status_checks")
        .select("status, response_time_ms, status_code, error_message, checked_at")
        .eq("service_id", svc.id)
        .order("checked_at", { ascending: false })
        .limit(HISTORY)

      const newestFirst = checks ?? []
      const upCount = newestFirst.filter((c) => c.status === "up").length
      const uptimePct = newestFirst.length
        ? Math.round((upCount / newestFirst.length) * 1000) / 10
        : null

      return {
        ...svc,
        latest: newestFirst[0] ?? null,
        history: [...newestFirst].reverse(), // oldest → newest, left → right
        uptimePct,
      }
    })
  )

  return NextResponse.json(
    {
      services: enriched,
      privateCount,
      privateUnlocked,
      privateConfigured: Boolean(pw),
      canCheck: canWrite,
      checkedNow,
    },
    { headers: { "cache-control": "no-store" } }
  )
}
