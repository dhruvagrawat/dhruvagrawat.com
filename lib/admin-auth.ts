import { createHash, timingSafeEqual } from "node:crypto"
import { NextResponse, type NextRequest } from "next/server"

/*
 * Server-side admin check for the write APIs.
 * The password is compared on the server; the browser only ever holds an httpOnly
 * session cookie derived from it. Set ADMIN_PASSWORD in Vercel (server-only).
 * NEXT_PUBLIC_ADMIN_PASSWORD is still read as a fallback so nothing breaks today,
 * but it is visible in the site's JavaScript — move to ADMIN_PASSWORD and delete it.
 */
export const ADMIN_COOKIE = "admin_session"

function password() {
  return process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ""
}

export function sessionToken() {
  const pw = password()
  return pw ? createHash("sha256").update(`dhruvagrawat.com:admin:${pw}`).digest("hex") : ""
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export function checkPassword(input: string) {
  const pw = password()
  return Boolean(pw) && safeEqual(input, pw)
}

export function isAdmin(req: NextRequest) {
  const token = sessionToken()
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value ?? ""
  return Boolean(token) && safeEqual(cookie, token)
}

/** Returns a 401 response when the caller isn't the logged-in admin, otherwise null. */
export function requireAdmin(req: NextRequest) {
  return isAdmin(req) ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
