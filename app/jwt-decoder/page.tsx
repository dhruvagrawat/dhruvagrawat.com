"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { CopyButton, monoArea } from "@/components/tools/copy-button"

// Example token (HS256, payload is public sample data — not a real credential)
const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRocnV2IEFncmF3YXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.signature-not-verified"

function b64urlDecode(part: string) {
  let s = part.replace(/-/g, "+").replace(/_/g, "/")
  while (s.length % 4) s += "="
  const bin = atob(s)
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

const TIME_CLAIMS: Record<string, string> = { exp: "Expires", iat: "Issued at", nbf: "Not before", auth_time: "Authenticated at" }

export default function JwtDecoderPage() {
  const [token, setToken] = useState(SAMPLE)
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const decoded = useMemo(() => {
    const t = token.trim().replace(/^Bearer\s+/i, "")
    if (!t) return null
    const parts = t.split(".")
    if (parts.length < 2) return { error: "A JWT has three parts separated by dots: header.payload.signature" }
    try {
      const header = JSON.parse(b64urlDecode(parts[0]))
      const payload = JSON.parse(b64urlDecode(parts[1]))
      return { header, payload, signature: parts[2] ?? "" }
    } catch {
      return { error: "Couldn't decode this token — the header or payload isn't valid Base64URL JSON." }
    }
  }, [token])

  const payload = decoded && "payload" in decoded ? (decoded.payload as Record<string, unknown>) : null
  const exp = typeof payload?.exp === "number" ? payload.exp * 1000 : null
  const expired = exp && now ? exp < now : false

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="jwt-in" className="text-sm font-medium">Encoded token</label>
          <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setToken("")}>Clear</button>
        </div>
        <textarea
          id="jwt-in"
          rows={5}
          value={token}
          spellCheck={false}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste a JWT (eyJ…)"
          className={`${monoArea} break-all`}
        />
      </div>

      {decoded && "error" in decoded && (
        <p className="flex items-start gap-2 text-sm text-red-500">
          <AlertCircle className="size-4 mt-0.5 shrink-0" /> {decoded.error}
        </p>
      )}

      {decoded && "payload" in decoded && (
        <>
          {exp && now && (
            <div
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                expired ? "border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400" : "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {expired ? <AlertCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
              {expired ? "Expired" : "Not expired"} — {expired ? "expired" : "expires"}{" "}
              {new Date(exp).toLocaleString()}
            </div>
          )}

          {(["header", "payload"] as const).map((k) => {
            const json = JSON.stringify(decoded[k], null, 2)
            return (
              <div key={k} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{k}</span>
                  <CopyButton value={json} />
                </div>
                <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-3 font-mono text-[13px] leading-relaxed">{json}</pre>
              </div>
            )
          })}

          {payload && Object.keys(TIME_CLAIMS).some((c) => typeof payload[c] === "number") && (
            <div className="rounded-xl border bg-card px-4">
              {Object.entries(TIME_CLAIMS)
                .filter(([c]) => typeof payload[c] === "number")
                .map(([c, label]) => (
                  <div key={c} className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-3.5" /> {label} <code className="text-xs">({c})</code>
                    </span>
                    <span className="tabular-nums text-right">{new Date((payload[c] as number) * 1000).toLocaleString()}</span>
                  </div>
                ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Signature ({decoded.signature ? `${decoded.signature.length} chars` : "missing"}) is not verified — verify tokens on
            your server with the secret or public key.
          </p>
        </>
      )}
    </div>
  )
}
