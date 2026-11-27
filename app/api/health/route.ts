import { NextResponse } from "next/server"
import { getStatusClient, hasSupabaseEnv } from "@/lib/status"

export const dynamic = "force-dynamic"

// GET /api/health – quick "is everything wired up?" check.
// 200 when the site is serving; `database` says whether Supabase answers.
// Point an uptime monitor here, or open it after a deploy.
export async function GET() {
  const started = Date.now()
  let database: "ok" | "not configured" | "error" = "not configured"
  let databaseMs: number | null = null

  if (hasSupabaseEnv()) {
    const t = Date.now()
    try {
      const { client } = getStatusClient()
      const { error } = await client
        .from("status_services")
        .select("id", { head: true, count: "exact" })
        .abortSignal(AbortSignal.timeout(5_000))
      database = error ? "error" : "ok"
    } catch {
      database = "error"
    }
    databaseMs = Date.now() - t
  }

  return NextResponse.json(
    {
      ok: true,
      database,
      databaseMs,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      region: process.env.VERCEL_REGION ?? null,
      time: new Date().toISOString(),
      ms: Date.now() - started,
    },
    { headers: { "cache-control": "no-store" } }
  )
}
