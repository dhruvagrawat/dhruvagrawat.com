"use client"

import { Fragment, useMemo, useState } from "react"
import { AlertCircle } from "lucide-react"
import { monoArea } from "@/components/tools/copy-button"

const FLAGS = [
  { f: "g", label: "global" },
  { f: "i", label: "ignore case" },
  { f: "m", label: "multiline" },
  { f: "s", label: "dotall" },
  { f: "u", label: "unicode" },
]

const CHEATS: [string, string][] = [
  ["\\d", "digit"],
  ["\\w", "word char"],
  ["\\s", "whitespace"],
  [".", "any char"],
  ["^ $", "start / end"],
  ["* + ?", "0+, 1+, 0–1"],
  ["{2,5}", "2 to 5 times"],
  ["[abc]", "a, b or c"],
  ["(…)", "capture group"],
  ["(?<name>…)", "named group"],
  ["a|b", "a or b"],
  ["(?=…)", "lookahead"],
]

const MAX_MATCHES = 1000

/** Names of capturing groups in order (undefined for unnamed ones). */
function groupNames(src: string): (string | undefined)[] {
  const names: (string | undefined)[] = []
  let inClass = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (c === "\\") { i++; continue }
    if (inClass) { if (c === "]") inClass = false; continue }
    if (c === "[") { inClass = true; continue }
    if (c !== "(") continue
    if (src[i + 1] !== "?") { names.push(undefined); continue }
    const named = src.slice(i).match(/^\(\?<([A-Za-z_$][\w$]*)>/)
    if (named) names.push(named[1])
  }
  return names
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("(?<user>[\\w.+-]+)@(?<domain>[\\w-]+\\.[\\w.]+)")
  const [flags, setFlags] = useState("g")
  const [text, setText] = useState(
    "Contact agrawatdhruv@gmail.com or hello@dhruvagrawat.com.\nInvalid: someone@ and @nowhere."
  )
  const [replace, setReplace] = useState("<$<user> at $<domain>>")

  const res = useMemo(() => {
    if (!pattern) return { re: null, matches: [] as RegExpMatchArray[], err: "" }
    try {
      const re = new RegExp(pattern, flags)
      const matches: RegExpMatchArray[] = []
      if (flags.includes("g")) {
        for (const m of text.matchAll(re)) {
          matches.push(m)
          if (matches.length >= MAX_MATCHES) break
        }
      } else {
        const m = text.match(re)
        if (m) matches.push(m)
      }
      return { re, matches, err: "" }
    } catch (e) {
      return { re: null, matches: [], err: e instanceof Error ? e.message : String(e) }
    }
  }, [pattern, flags, text])

  const names = useMemo(() => groupNames(pattern), [pattern])

  // Highlighted text
  const pieces = useMemo(() => {
    const out: { t: string; hit: boolean }[] = []
    let last = 0
    for (const m of res.matches) {
      const start = m.index ?? 0
      const end = start + m[0].length
      if (start < last) continue
      out.push({ t: text.slice(last, start), hit: false })
      out.push({ t: m[0] || "", hit: true })
      last = end
    }
    out.push({ t: text.slice(last), hit: false })
    return out
  }, [res.matches, text])

  const replaced = useMemo(() => {
    if (!res.re) return ""
    try {
      return text.replace(res.re, replace)
    } catch {
      return ""
    }
  }, [res.re, text, replace])

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="re" className="text-sm font-medium">Regular expression</label>
        <div className="flex items-center rounded-lg border bg-background font-mono text-sm focus-within:ring-2 focus-within:ring-ring">
          <span className="pl-3 text-muted-foreground">/</span>
          <input id="re" value={pattern} spellCheck={false} onChange={(e) => setPattern(e.target.value)} className="h-10 flex-1 bg-transparent px-1 outline-none" />
          <span className="text-muted-foreground">/</span>
          <input
            aria-label="Flags"
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuyd]/g, ""))}
            className="h-10 w-14 bg-transparent px-1 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {FLAGS.map(({ f, label }) => (
            <label key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={flags.includes(f)}
                onChange={(e) => setFlags((cur) => (e.target.checked ? cur + f : cur.replace(f, "")))}
              />
              <code>{f}</code> {label}
            </label>
          ))}
        </div>
        {res.err && (
          <p className="flex items-start gap-2 text-sm text-red-500">
            <AlertCircle className="size-4 mt-0.5 shrink-0" /> {res.err}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="re-text" className="text-sm font-medium">Test string</label>
        <textarea id="re-text" rows={6} value={text} onChange={(e) => setText(e.target.value)} className={monoArea} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          {res.matches.length} match{res.matches.length === 1 ? "" : "es"}
          {res.matches.length >= MAX_MATCHES && ` (showing first ${MAX_MATCHES})`}
        </p>
        <div className="whitespace-pre-wrap break-words rounded-lg border bg-muted/30 p-3 font-mono text-[13px] leading-relaxed">
          {pieces.map((p, i) =>
            p.hit ? (
              <mark key={i} className="rounded-sm bg-amber-300/70 px-0.5 text-foreground dark:bg-amber-500/40">
                {p.t || "∅"}
              </mark>
            ) : (
              <Fragment key={i}>{p.t}</Fragment>
            )
          )}
        </div>
      </div>

      {res.matches.length > 0 && res.matches.some((m) => m.length > 1) && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">#</th>
                <th className="px-3 py-2 text-left font-medium">Match</th>
                {res.matches[0].slice(1).map((_, gi) => (
                  <th key={gi} className="px-3 py-2 text-left font-medium">
                    {names[gi] ?? `Group ${gi + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono">
              {res.matches.slice(0, 50).map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-1.5">{m[0]}</td>
                  {m.slice(1).map((g, gi) => (
                    <td key={gi} className="px-3 py-1.5">{g ?? <span className="text-muted-foreground">—</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="re-rep" className="text-sm font-medium">Replace with <span className="font-normal text-muted-foreground">($1, $&lt;name&gt;, $&amp;)</span></label>
        <input id="re-rep" value={replace} onChange={(e) => setReplace(e.target.value)} className="h-10 w-full rounded-md border bg-background px-3 font-mono text-sm" />
        <pre className="whitespace-pre-wrap break-words rounded-lg border bg-muted/30 p-3 font-mono text-[13px]">{replaced}</pre>
      </div>

      <details className="rounded-xl border bg-card">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">Cheat sheet</summary>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 border-t px-4 py-3 text-sm sm:grid-cols-3">
          {CHEATS.map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <code className="min-w-16 text-foreground">{k}</code>
              <span className="text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
