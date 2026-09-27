import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Looks up the visitor's IP on the server. Calling ip-api.com straight from the browser
// fails on HTTPS (its free tier is HTTP-only, so browsers block it as mixed content).
export async function GET(req: NextRequest) {
  const h = req.headers
  const ip =
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    ""

  // Vercel adds approximate geo headers for free — used as a fallback.
  const fromHeaders = {
    query: ip,
    city: decodeURIComponent(h.get("x-vercel-ip-city") ?? ""),
    regionName: h.get("x-vercel-ip-country-region") ?? "",
    country: h.get("x-vercel-ip-country") ?? "",
    countryCode: h.get("x-vercel-ip-country") ?? "",
    isp: "",
    org: "",
    timezone: h.get("x-vercel-ip-timezone") ?? "",
    lat: Number(h.get("x-vercel-ip-latitude") ?? NaN),
    lon: Number(h.get("x-vercel-ip-longitude") ?? NaN),
    zip: h.get("x-vercel-ip-postal-code") ?? "",
  }

  const isPrivate = !ip || /^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|fc|fd)/.test(ip)
  if (!isPrivate) {
    try {
      const res = await fetch(
        `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,query,city,regionName,country,countryCode,isp,org,timezone,lat,lon,zip`,
        { signal: AbortSignal.timeout(5_000), cache: "no-store" }
      )
      const data = await res.json()
      if (data?.status === "success") {
        return NextResponse.json(data, { headers: { "cache-control": "no-store" } })
      }
    } catch {
      /* fall through to header data */
    }
  }

  if (!ip) return NextResponse.json({ error: "Could not determine your IP address." }, { status: 500 })
  return NextResponse.json(fromHeaders, { headers: { "cache-control": "no-store" } })
}
