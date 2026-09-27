"use client"

import { useEffect, useState } from "react"
import { Upload } from "lucide-react"
import { CopyButton, monoArea } from "@/components/tools/copy-button"

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const
type Algo = (typeof ALGOS)[number]

async function digest(algo: Algo, data: BufferSource) {
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("")
}

export default function HashPage() {
  const [text, setText] = useState("hello world")
  const [file, setFile] = useState<File | null>(null)
  const [upper, setUpper] = useState(false)
  const [hashes, setHashes] = useState<Partial<Record<Algo, string>>>({})
  const [busy, setBusy] = useState(false)
  const [compare, setCompare] = useState("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setBusy(true)
      try {
        const data = file ? await file.arrayBuffer() : new TextEncoder().encode(text)
        const out: Partial<Record<Algo, string>> = {}
        for (const a of ALGOS) out[a] = await digest(a, data)
        if (!cancelled) setHashes(out)
      } catch {
        if (!cancelled) setHashes({})
      } finally {
        if (!cancelled) setBusy(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [text, file])

  const cmp = compare.trim().toLowerCase()
  const match = cmp ? ALGOS.find((a) => hashes[a] === cmp) : undefined

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="hash-in" className="text-sm font-medium">{file ? "File" : "Text"}</label>
          <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
            <Upload className="size-3.5" /> Hash a file
            <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {file ? (
          <div className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm">
            <span className="truncate">
              {file.name} <span className="text-muted-foreground">· {(file.size / 1024).toFixed(1)} KB</span>
            </span>
            <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setFile(null)}>
              Use text instead
            </button>
          </div>
        ) : (
          <textarea id="hash-in" rows={5} value={text} onChange={(e) => setText(e.target.value)} className={monoArea} />
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase
      </label>

      <div className={`rounded-xl border bg-card px-4 transition-opacity ${busy ? "opacity-60" : ""}`}>
        {ALGOS.map((a) => {
          const v = hashes[a] ? (upper ? hashes[a]!.toUpperCase() : hashes[a]!) : "…"
          return (
            <div key={a} className="flex items-center justify-between gap-3 py-3 border-b last:border-0">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {a}
                  {match === a && <span className="ml-2 text-emerald-500">✓ matches</span>}
                </p>
                <p className="font-mono text-xs sm:text-sm break-all">{v}</p>
              </div>
              <CopyButton value={hashes[a] ? v : ""} label="" className="px-2" />
            </div>
          )
        })}
      </div>

      <label className="grid gap-1 text-sm">
        Compare with a known hash (optional)
        <input
          value={compare}
          onChange={(e) => setCompare(e.target.value)}
          placeholder="Paste a checksum to verify"
          className="h-10 rounded-md border bg-background px-3 font-mono text-sm"
        />
        {cmp && (
          <span className={match ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}>
            {match ? `Match — this is the ${match} hash.` : "No match with any of the hashes above."}
          </span>
        )}
      </label>
    </div>
  )
}
