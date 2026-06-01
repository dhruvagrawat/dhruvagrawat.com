"use client"

import { useState, useCallback } from "react"
import { RefreshCw, Copy, Check, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWER = "abcdefghijklmnopqrstuvwxyz"
const NUMS  = "0123456789"
const SYMS  = "!@#$%^&*()-_=+[]{}|;:,.<>?"

function generate(len: number, opts: { upper: boolean; lower: boolean; nums: boolean; syms: boolean }) {
  let pool = ""
  if (opts.upper) pool += UPPER
  if (opts.lower) pool += LOWER
  if (opts.nums)  pool += NUMS
  if (opts.syms)  pool += SYMS
  if (!pool) pool = LOWER

  const arr = new Uint32Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr).map((n) => pool[n % pool.length]).join("")
}

function strength(pw: string): { label: string; score: number } {
  let s = 0
  if (pw.length >= 12) s++
  if (pw.length >= 20) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { label: "Weak", score: 1 }
  if (s <= 3) return { label: "Fair", score: 2 }
  if (s === 4) return { label: "Strong", score: 3 }
  return { label: "Very strong", score: 4 }
}

export default function PasswordPage() {
  const [length, setLength] = useState(20)
  const [opts, setOpts] = useState({ upper: true, lower: true, nums: true, syms: false })
  const [password, setPassword] = useState(() => generate(20, { upper: true, lower: true, nums: true, syms: false }))
  const [copied, setCopied] = useState(false)

  const regen = useCallback(() => setPassword(generate(length, opts)), [length, opts])

  function toggle(key: keyof typeof opts) {
    const next = { ...opts, [key]: !opts[key] }
    setOpts(next)
    setPassword(generate(length, next))
  }

  function changeLen(v: number[]) {
    setLength(v[0])
    setPassword(generate(v[0], opts))
  }

  function copy() {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const { label: strengthLabel, score } = strength(password)
  const strengthColors = ["", "bg-red-500", "bg-amber-400", "bg-blue-500", "bg-emerald-500"]
  const StrengthIcon = score <= 1 ? ShieldX : score <= 2 ? ShieldAlert : ShieldCheck
  const iconColor = score <= 1 ? "text-red-500" : score <= 2 ? "text-amber-400" : score <= 3 ? "text-blue-500" : "text-emerald-500"

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
      <p className="text-muted-foreground mb-8">Cryptographically random — generated entirely in your browser.</p>

      {/* Password display */}
      <div className="rounded-2xl border bg-card p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <p className="font-mono text-lg flex-1 break-all select-all">{password}</p>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="icon" onClick={regen} title="Regenerate">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={copy} title="Copy">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Strength bar */}
        <div className="flex items-center gap-3">
          <StrengthIcon className={`h-4 w-4 ${iconColor} shrink-0`} />
          <div className="flex gap-1 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= score ? strengthColors[score] : "bg-muted"}`} />
            ))}
          </div>
          <span className={`text-xs font-medium ${iconColor}`}>{strengthLabel}</span>
        </div>
      </div>

      {/* Length */}
      <div className="mb-6">
        <div className="flex justify-between mb-3">
          <Label>Length</Label>
          <span className="text-sm font-mono font-semibold">{length}</span>
        </div>
        <Slider value={[length]} min={6} max={64} step={1} onValueChange={changeLen} />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {(["upper", "lower", "nums", "syms"] as const).map((key) => ({
          upper: "Uppercase (A–Z)", lower: "Lowercase (a–z)",
          nums: "Numbers (0–9)", syms: "Symbols (!@#…)"
        }[key] && (
          <label key={key} className="flex items-center gap-2.5 rounded-xl border bg-card p-3 cursor-pointer hover:bg-muted/40 transition-colors">
            <Checkbox
              checked={opts[key]}
              onCheckedChange={() => toggle(key)}
              id={key}
            />
            <span className="text-sm">{{ upper: "Uppercase", lower: "Lowercase", nums: "Numbers", syms: "Symbols" }[key]}</span>
          </label>
        )))}
      </div>
    </div>
  )
}
