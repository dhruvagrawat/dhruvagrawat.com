"use client"

import { useMemo, useState } from "react"
import { ArrowDownUp, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CopyButton, monoArea } from "@/components/tools/copy-button"

type Mode = "encode" | "decode"

function encode(text: string, urlSafe: boolean) {
  const bytes = new TextEncoder().encode(text)
  let bin = ""
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  const b64 = btoa(bin)
  return urlSafe ? b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : b64
}

function decode(b64: string) {
  let s = b64.trim().replace(/^data:[^,]*,/, "").replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/")
  while (s.length % 4) s += "="
  const bin = atob(s)
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
}

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>("encode")
  const [input, setInput] = useState("Hello, world! 👋 नमस्ते")
  const [urlSafe, setUrlSafe] = useState(false)
  const [fileInfo, setFileInfo] = useState<string | null>(null)

  const result = useMemo(() => {
    if (!input) return { out: "", err: "" }
    try {
      return { out: mode === "encode" ? encode(input, urlSafe) : decode(input), err: "" }
    } catch {
      return {
        out: "",
        err: mode === "decode" ? "That isn't valid Base64 (or it decodes to binary data, not text)." : "Couldn't encode this input.",
      }
    }
  }, [input, mode, urlSafe])

  function swap() {
    if (result.out) setInput(result.out)
    setMode((m) => (m === "encode" ? "decode" : "encode"))
    setFileInfo(null)
  }

  function onFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setFileInfo("Files up to 10 MB, please.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result)
      setMode("decode")
      setInput(dataUrl)
      setFileInfo(`${file.name} · ${(file.size / 1024).toFixed(1)} KB → data URL (${dataUrl.length.toLocaleString()} chars)`)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border p-1 bg-muted/40" role="tablist">
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => { setMode(m); setFileInfo(null) }}
            className={`px-4 py-1.5 text-sm rounded-md capitalize transition-colors ${
              mode === m ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="b64-in" className="text-sm font-medium">
            {mode === "encode" ? "Text" : "Base64"}
          </label>
          <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
            <Upload className="size-3.5" /> File → Base64
            <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>
        </div>
        <textarea
          id="b64-in"
          rows={7}
          value={input}
          spellCheck={false}
          onChange={(e) => { setInput(e.target.value); setFileInfo(null) }}
          className={monoArea}
        />
        {fileInfo && <p className="text-xs text-muted-foreground">{fileInfo}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={swap} className="gap-2">
          <ArrowDownUp className="size-4" /> Swap
        </Button>
        {mode === "encode" && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} />
            URL-safe (no + / =)
          </label>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="b64-out" className="text-sm font-medium">
            {mode === "encode" ? "Base64" : "Text"}
          </label>
          <CopyButton value={result.out} />
        </div>
        <textarea id="b64-out" readOnly rows={7} value={result.out} className={monoArea} />
        {result.err && <p className="text-sm text-red-500">{result.err}</p>}
        {result.out && (
          <p className="text-xs text-muted-foreground">
            {input.length.toLocaleString()} → {result.out.length.toLocaleString()} characters
          </p>
        )}
      </div>
    </div>
  )
}
