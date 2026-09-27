"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/tools/copy-button"

// Split any text into words, handling camelCase, snake_case, kebab-case and punctuation.
function words(s: string) {
  return s
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
}

const SMALL = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "up", "via", "vs"])
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()

const perLine = (s: string, f: (line: string) => string) => s.split("\n").map(f).join("\n")

const CASES: { id: string; label: string; fn: (s: string) => string }[] = [
  { id: "upper", label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { id: "lower", label: "lowercase", fn: (s) => s.toLowerCase() },
  {
    id: "title",
    label: "Title Case",
    fn: (s) =>
      perLine(s, (line) =>
        line
          .toLowerCase()
          .replace(/[\p{L}\p{N}'’]+/gu, (w, offset: number) =>
            offset > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)
          )
      ),
  },
  {
    id: "sentence",
    label: "Sentence case",
    fn: (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)(\p{L})/gu, (_, p: string, c: string) => p + c.toUpperCase()),
  },
  { id: "camel", label: "camelCase", fn: (s) => perLine(s, (l) => words(l).map((w, i) => (i ? cap(w) : w.toLowerCase())).join("")) },
  { id: "pascal", label: "PascalCase", fn: (s) => perLine(s, (l) => words(l).map(cap).join("")) },
  { id: "snake", label: "snake_case", fn: (s) => perLine(s, (l) => words(l).map((w) => w.toLowerCase()).join("_")) },
  { id: "kebab", label: "kebab-case", fn: (s) => perLine(s, (l) => words(l).map((w) => w.toLowerCase()).join("-")) },
  { id: "constant", label: "CONSTANT_CASE", fn: (s) => perLine(s, (l) => words(l).map((w) => w.toUpperCase()).join("_")) },
  { id: "dot", label: "dot.case", fn: (s) => perLine(s, (l) => words(l).map((w) => w.toLowerCase()).join(".")) },
  {
    id: "alternating",
    label: "aLtErNaTiNg",
    fn: (s) => {
      let k = 0
      return [...s].map((c) => (/\p{L}/u.test(c) ? (k++ % 2 ? c.toUpperCase() : c.toLowerCase()) : c)).join("")
    },
  },
  {
    id: "inverse",
    label: "iNVERSE",
    fn: (s) => [...s].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join(""),
  },
]

export default function CaseConverterPage() {
  const [text, setText] = useState("the quick brown fox jumps over the lazy dog")
  const outputs = useMemo(() => CASES.map((c) => ({ ...c, out: c.fn(text) })), [text])

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="case-in" className="text-sm font-medium">Your text</label>
          <span className="text-xs text-muted-foreground">{[...text].length} characters</span>
        </div>
        <textarea
          id="case-in"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg border bg-background p-3 text-[15px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {outputs.map((c) => (
          <div key={c.id} className="rounded-xl border bg-card p-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setText(c.out)}
                  className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Use
                </button>
                <CopyButton value={c.out} />
              </div>
            </div>
            <p className="line-clamp-3 whitespace-pre-wrap break-words font-mono text-sm">{c.out || <span className="text-muted-foreground">—</span>}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
