"use client"

import { useState, useRef } from "react"
import QRCode from "react-qr-code"
import { Copy, Check, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SIZES = [150, 200, 300, 400] as const

export default function QrPage() {
  const [text, setText] = useState("")
  const [size, setSize] = useState<number>(300)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function download() {
    const svg = qrRef.current?.querySelector("svg")
    if (!svg) return

    const xml = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([xml], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "qr-code.svg"
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasValue = text.trim().length > 0

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
      <p className="text-muted-foreground mb-8">
        Turn any URL or text into a QR code — generated locally, works offline.
      </p>

      <div className="space-y-4 mb-8">
        <Input
          placeholder="https://example.com or any text…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Size:</span>
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                size === s
                  ? "bg-foreground text-background"
                  : "border hover:bg-muted"
              }`}
            >
              {s}px
            </button>
          ))}
        </div>
      </div>

      {hasValue ? (
        <div className="flex flex-col items-center gap-6">
          <div
            ref={qrRef}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <QRCode value={text.trim()} size={size} />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={copy} className="gap-2">
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy text"}
            </Button>
            <Button onClick={download} className="gap-2">
              <Download className="h-4 w-4" />
              Download SVG
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 rounded-2xl border border-dashed text-muted-foreground">
          <p className="text-sm">QR code will appear here</p>
        </div>
      )}
    </div>
  )
}
