import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE, checkPassword, sessionToken } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }))
  // small fixed delay makes password guessing slower
  await new Promise((r) => setTimeout(r, 600))
  if (!checkPassword(String(password ?? ""))) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
