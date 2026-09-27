"use client"

import { useMemo, useState } from "react"
import { ArrowDownUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Segmented } from "@/components/tools/calc-ui"
import { CopyButton, monoArea } from "@/components/tools/copy-button"

type Mode = "encode" | "decode"
type Scope = "component" | "full"

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<Mode>("encode")
  const [scope, setScope] = useState<Scope>("component")
  const [input, setInput] = useState("https://dhruvagrawat.com/search?q=hello world&city=New Delhi&tag=c++")

  const out = useMemo(() => {
    if (!input) return { value: "", err: "" }
    try {
      if (mode === "encode") {
        return { value: scope === "component" ? encodeURIComponent(input) : encodeURI(input), err: "" }
      }
      const s = input.replace(/\+/g, " ")
      return { value: scope === "component" ? decodeURIComponent(s) : decodeURI(s), err: "" }
    } catch {
      return { value: "", err: "This text contains an invalid percent-escape (e.g. a lone %)." }
    }
  }, [input, mode, scope])

  // Parse whichever side looks like a URL
  const parsed = useMemo(() => {
    for (const candidate of [mode === "decode" ? out.value : input, input, out.value]) {
      try {
        const u = new URL(candidate.trim())
        return u
      } catch {
        /* not a URL */
      }
    }
    return null
  }, [input, out.value, mode])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <Segmented
          label="Direction"
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "Encode" },
            { value: "decode", label: "Decode" },
          ]}
        />
        <Segmented
          label="Scope"
          value={scope}
          onChange={setScope}
          options={[
            { value: "component", label: "Query value (encodeURIComponent)" },
            { value: "full", label: "Full URL (encodeURI)" },
          ]}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="url-in" className="text-sm font-medium">Input</label>
        <textarea id="url-in" rows={4} value={input} spellCheck={false} onChange={(e) => setInput(e.target.value)} className={`${monoArea} break-all`} />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => {
          if (out.value) setInput(out.value)
          setMode((m) => (m === "encode" ? "decode" : "encode"))
        }}
      >
        <ArrowDownUp className="size-4" /> Swap
      </Button>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="url-out" className="text-sm font-medium">Output</label>
          <CopyButton value={out.value} />
        </div>
        <textarea id="url-out" rows={4} readOnly value={out.value} className={`${monoArea} break-all`} />
        {out.err && <p className="text-sm text-red-500">{out.err}</p>}
      </div>

      {parsed && (
        <div className="rounded-xl border bg-card">
          <p className="border-b px-4 py-2.5 text-sm font-medium">URL breakdown</p>
          <dl className="divide-y text-sm">
            {[
              ["Protocol", parsed.protocol],
              ["Host", parsed.host],
              ["Path", decodeURIComponent(parsed.pathname)],
              ["Hash", parsed.hash],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-mono break-all text-right">{v}</dd>
                </div>
              ))}
          </dl>
          {[...parsed.searchParams].length > 0 && (
            <div className="overflow-x-auto border-t">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Parameter</th>
                    <th className="px-4 py-2 text-left font-medium">Value (decoded)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...parsed.searchParams].map(([k, v], i) => (
                    <tr key={k + i} className="border-t">
                      <td className="px-4 py-2 font-mono">{k}</td>
                      <td className="px-4 py-2 font-mono break-all">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
