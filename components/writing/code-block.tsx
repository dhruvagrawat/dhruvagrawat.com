"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="not-prose group relative my-6 overflow-hidden rounded-xl border bg-[oklch(0.2_0.015_258)] text-[oklch(0.93_0.01_85)] dark:bg-[oklch(0.14_0.015_258)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
        <span>{lang || "code"}</span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            } catch {
              /* clipboard blocked */
            }
          }}
          className="flex items-center gap-1.5 rounded-md px-2 py-0.5 normal-case tracking-normal text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
