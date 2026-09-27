"use client"

import { useMemo, useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CopyButton, monoArea } from "@/components/tools/copy-button"

const SAMPLE = `{"name":"Dhruv Agrawat","role":"Full-Stack Engineer","skills":["React","Next.js","Node.js"],"available":true,"projects":30}`

type Indent = "2" | "4" | "tab"

// Turn a JSON.parse error position into "line X, column Y".
function locate(text: string, message: string) {
  const m = message.match(/position (\d+)/i)
  const lc = message.match(/line (\d+) column (\d+)/i)
  if (lc) return { line: Number(lc[1]), col: Number(lc[2]) }
  if (!m) return null
  const pos = Number(m[1])
  const before = text.slice(0, pos).split("\n")
  return { line: before.length, col: before[before.length - 1].length + 1 }
}

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys)
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.keys(v as Record<string, unknown>)
        .sort()
        .map((k) => [k, sortKeys((v as Record<string, unknown>)[k])])
    )
  }
  return v
}

export default function JsonFormatterPage() {
  const [input, setInput] = useState(SAMPLE)
  const [output, setOutput] = useState("")
  const [indent, setIndent] = useState<Indent>("2")
  const [sorted, setSorted] = useState(false)

  const parsed = useMemo(() => {
    if (!input.trim()) return { ok: false as const, empty: true as const }
    try {
      return { ok: true as const, value: JSON.parse(input) as unknown }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      return { ok: false as const, empty: false as const, msg, where: locate(input, msg) }
    }
  }, [input])

  const space = indent === "tab" ? "\t" : Number(indent)

  function format(minify = false) {
    if (!parsed.ok) return
    const v = sorted ? sortKeys(parsed.value) : parsed.value
    setOutput(minify ? JSON.stringify(v) : JSON.stringify(v, null, space))
  }

  const stats = parsed.ok
    ? `${new Blob([input]).size.toLocaleString()} bytes · ${
        Array.isArray(parsed.value) ? `array of ${parsed.value.length}` : typeof parsed.value
      }`
    : ""

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="json-in" className="text-sm font-medium">Input</label>
          <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => { setInput(""); setOutput("") }}>
            Clear
          </button>
        </div>
        <textarea
          id="json-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          spellCheck={false}
          placeholder='Paste JSON here, e.g. {"hello": "world"}'
          className={monoArea}
        />
        {!parsed.ok && !parsed.empty && (
          <p className="flex items-start gap-2 text-sm text-red-500">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <span>
              Invalid JSON{parsed.where ? ` at line ${parsed.where.line}, column ${parsed.where.col}` : ""}: {parsed.msg}
            </span>
          </p>
        )}
        {parsed.ok && (
          <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" /> Valid JSON <span className="text-muted-foreground">· {stats}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => format(false)} disabled={!parsed.ok}>Format</Button>
        <Button variant="outline" onClick={() => format(true)} disabled={!parsed.ok}>Minify</Button>
        <select
          aria-label="Indentation"
          value={indent}
          onChange={(e) => setIndent(e.target.value as Indent)}
          className="h-9 rounded-md border bg-background px-2 text-sm"
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="tab">Tabs</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} />
          Sort keys
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="json-out" className="text-sm font-medium">Output</label>
          <CopyButton value={output} />
        </div>
        <textarea
          id="json-out"
          readOnly
          value={output}
          rows={12}
          placeholder="Formatted JSON appears here"
          className={monoArea}
        />
      </div>
    </div>
  )
}
