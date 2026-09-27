"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/tools/copy-button"

const LIMITS = [
  { label: "X / Twitter post", max: 280 },
  { label: "Meta description", max: 160 },
  { label: "Instagram caption", max: 2200 },
  { label: "LinkedIn post", max: 3000 },
]

function fmtMinutes(words: number, wpm: number) {
  if (!words) return "0 sec"
  const secs = Math.round((words / wpm) * 60)
  if (secs < 60) return `${secs} sec`
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return s ? `${m} min ${s} sec` : `${m} min`
}

export default function WordCounterPage() {
  const [text, setText] = useState("")

  const s = useMemo(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/u).filter(Boolean) : []
    const chars = [...text].length
    const noSpaces = [...text.replace(/\s/g, "")].length
    const sentences = trimmed ? (trimmed.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/gu) ?? []).filter((x) => x.trim()).length : 0
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0
    const freq = new Map<string, number>()
    for (const w of words) {
      const k = w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
      if (k.length > 3) freq.set(k, (freq.get(k) ?? 0) + 1)
    }
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    return { words: words.length, chars, noSpaces, sentences, paragraphs, top }
  }, [text])

  const cards = [
    ["Words", s.words],
    ["Characters", s.chars],
    ["Without spaces", s.noSpaces],
    ["Sentences", s.sentences],
    ["Paragraphs", s.paragraphs],
  ] as const

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {cards.map(([label, n]) => (
          <div key={label} className="rounded-xl border bg-card p-3 text-center">
            <p className="text-2xl font-semibold tabular-nums">{n.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="wc-in" className="text-sm font-medium">Your text</label>
          <div className="flex gap-2">
            <CopyButton value={text} />
            <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setText("")}>Clear</button>
          </div>
        </div>
        <textarea
          id="wc-in"
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text…"
          className="w-full rounded-lg border bg-background p-3 text-[15px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 space-y-1 text-sm">
          <p className="font-medium mb-1">Time</p>
          <p className="flex justify-between"><span className="text-muted-foreground">Reading</span>{fmtMinutes(s.words, 238)}</p>
          <p className="flex justify-between"><span className="text-muted-foreground">Speaking</span>{fmtMinutes(s.words, 150)}</p>
          {s.top.length > 0 && (
            <>
              <p className="font-medium mt-3 mb-1">Top words</p>
              <p className="text-muted-foreground">{s.top.map(([w, n]) => `${w} (${n})`).join(", ")}</p>
            </>
          )}
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-2.5 text-sm">
          <p className="font-medium">Character limits</p>
          {LIMITS.map((l) => {
            const pct = Math.min(100, (s.chars / l.max) * 100)
            const over = s.chars > l.max
            return (
              <div key={l.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{l.label}</span>
                  <span className={over ? "text-red-500" : "text-muted-foreground"}>
                    {s.chars.toLocaleString()} / {l.max.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${over ? "bg-red-500" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
