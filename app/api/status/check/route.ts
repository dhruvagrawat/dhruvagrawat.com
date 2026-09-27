import { NextRequest, NextResponse } from "next/server"
import { getStatusClient, hasSupabaseEnv, runChecks } from "@/lib/status"

export const dynamic = "force-dynamic"
export const maxDuration = 30

// Runs a round of checks. Called by the Vercel cron in vercel.json (GET) or manually (POST).
// When CRON_SECRET is set, requests must send `Authorization: Bearer <CRON_SECRET>`
// (Vercel Cron does this automatically).
async function handle(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 503 }
    )
  }

  const { client } = getStatusClient()
  let query = client.from("status_services").select("id, name, url").eq("active", true)

  if (req.method === "POST") {
    const body = await req.json().catch(() => ({}))
    if (body?.serviceId) query = query.eq("id", body.serviceId)
  }

  const { data: services, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!services?.length) return NextResponse.json({ checked: 0 })

  const results = await runChecks(client, services)
  return NextResponse.json({ checked: results.length, results })
}

export const GET = handle
export const POST = handle
