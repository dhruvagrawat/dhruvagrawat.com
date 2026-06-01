import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET /api/status/services
// Returns all services with their latest check + 90-day history (one per day)
export async function GET() {
  const supabase = getSupabase()

  const { data: services, error } = await supabase
    .from("status_services")
    .select("*")
    .eq("active", true)
    .order("group_name")
    .order("name")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!services?.length) return NextResponse.json([])

  // For each service fetch latest check + last 90 checks for history bars
  const enriched = await Promise.all(
    services.map(async (svc) => {
      const { data: checks } = await supabase
        .from("status_checks")
        .select("status, response_time_ms, status_code, checked_at")
        .eq("service_id", svc.id)
        .order("checked_at", { ascending: false })
        .limit(90)

      const latest = checks?.[0] ?? null
      const history = checks ?? []

      // Uptime % over available history
      const upCount = history.filter((c) => c.status === "up").length
      const uptimePct =
        history.length > 0 ? Math.round((upCount / history.length) * 100) : null

      return { ...svc, latest, history, uptimePct }
    })
  )

  return NextResponse.json(enriched)
}
