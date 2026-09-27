"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CopyButton, monoArea } from "@/components/tools/copy-button"

function uuidv4() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID()
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("")
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export default function UuidPage() {
  const [count, setCount] = useState(5)
  const [upper, setUpper] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [braces, setBraces] = useState(false)
  const [list, setList] = useState<string[]>([])

  const generate = useCallback(() => {
    const n = Math.min(500, Math.max(1, count || 1))
    setList(Array.from({ length: n }, uuidv4))
  }, [count])

  // generated after mount so server and browser render the same HTML
  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fmt = (u: string) => {
    let s = hyphens ? u : u.replace(/-/g, "")
    if (upper) s = s.toUpperCase()
    return braces ? `{${s}}` : s
  }
  const text = list.map(fmt).join("\n")

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-card p-5 text-center">
        <p className="text-xs text-muted-foreground mb-2">Your UUID</p>
        <p className="font-mono text-base sm:text-xl break-all min-h-7">{list[0] ? fmt(list[0]) : "…"}</p>
        <div className="mt-3 flex justify-center gap-2">
          <CopyButton value={list[0] ? fmt(list[0]) : ""} />
          <button
            onClick={() => setList((l) => [uuidv4(), ...l.slice(1)])}
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="size-3.5" /> New
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <label className="grid gap-1 text-sm">
          How many
          <input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-9 w-24 rounded-md border bg-background px-2"
          />
        </label>
        {[
          ["Uppercase", upper, setUpper],
          ["Hyphens", hyphens, setHyphens],
          ["{Braces}", braces, setBraces],
        ].map(([label, val, set]) => (
          <label key={label as string} className="flex items-center gap-2 text-sm text-muted-foreground h-9">
            <input
              type="checkbox"
              checked={val as boolean}
              onChange={(e) => (set as (v: boolean) => void)(e.target.checked)}
            />
            {label as string}
          </label>
        ))}
        <Button onClick={generate} className="gap-2">
          <RefreshCw className="size-4" /> Generate
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{list.length} UUID{list.length === 1 ? "" : "s"}</span>
          <CopyButton value={text} label="Copy all" />
        </div>
        <textarea readOnly rows={Math.min(12, Math.max(4, list.length))} value={text} className={monoArea} aria-label="Generated UUIDs" />
      </div>
    </div>
  )
}
