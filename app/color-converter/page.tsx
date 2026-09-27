"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/tools/copy-button"

type RGB = { r: number; g: number; b: number }

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

function hexToRgb(hex: string): RGB | null {
  let h = hex.trim().replace(/^#/, "")
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split("").map((c) => c + c).join("")
  if (!/^[0-9a-f]{6}$/i.test(h)) return null
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}
const rgbToHex = ({ r, g, b }: RGB) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")

function rgbToHsl({ r, g, b }: RGB) {
  const [R, G, B] = [r / 255, g / 255, b / 255]
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    h = max === R ? (G - B) / d + (G < B ? 6 : 0) : max === G ? (B - R) / d + 2 : (R - G) / d + 4
    h *= 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): RGB {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}

function parseAny(input: string): RGB | null {
  const s = input.trim().toLowerCase()
  const hex = hexToRgb(s)
  if (hex) return hex
  const rgb = s.match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/)
  if (rgb) return { r: clamp(+rgb[1], 0, 255), g: clamp(+rgb[2], 0, 255), b: clamp(+rgb[3], 0, 255) }
  const hsl = s.match(/^hsla?\(\s*(\d{1,3}(?:\.\d+)?)(?:deg)?[\s,]+(\d{1,3}(?:\.\d+)?)%?[\s,]+(\d{1,3}(?:\.\d+)?)%?/)
  if (hsl) return hslToRgb(+hsl[1] % 360, clamp(+hsl[2], 0, 100), clamp(+hsl[3], 0, 100))
  return null
}

function luminance({ r, g, b }: RGB) {
  const c = [r, g, b].map((v) => {
    const x = v / 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
function contrast(a: RGB, b: RGB) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

function Grade({ ratio }: { ratio: number }) {
  const label = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA large" : "Fail"
  const ok = ratio >= 4.5
  return (
    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${ok ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-500"}`}>
      {label}
    </span>
  )
}

export default function ColorConverterPage() {
  const [rgb, setRgb] = useState<RGB>({ r: 37, g: 99, b: 235 })
  const [text, setText] = useState("#2563eb")
  const [bad, setBad] = useState(false)

  const hex = rgbToHex(rgb)
  const hsl = rgbToHsl(rgb)
  const formats = useMemo(
    () => [
      ["HEX", hex.toUpperCase()],
      ["RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
      ["HSL", `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
      ["CSS variable", `--color: ${hex};`],
      ["Tailwind arbitrary", `bg-[${hex}]`],
    ],
    [hex, rgb, hsl]
  )

  const white = contrast(rgb, { r: 255, g: 255, b: 255 })
  const black = contrast(rgb, { r: 0, g: 0, b: 0 })

  function set(next: RGB, updateText = true) {
    setRgb(next)
    if (updateText) setText(rgbToHex(next))
    setBad(false)
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-[180px_1fr] gap-4">
        <label className="relative block h-40 sm:h-full min-h-40 rounded-xl border overflow-hidden cursor-pointer" style={{ background: hex }}>
          <input
            type="color"
            value={hex}
            onChange={(e) => set(hexToRgb(e.target.value)!)}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
            aria-label="Pick a color"
          />
          <span className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[11px] text-white">Click to pick</span>
        </label>

        <div className="space-y-3">
          <label className="grid gap-1 text-sm">
            Paste any color (HEX, rgb(), hsl())
            <input
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                const p = parseAny(e.target.value)
                if (p) set(p, false)
                else setBad(Boolean(e.target.value.trim()))
              }}
              className={`h-10 rounded-md border bg-background px-3 font-mono ${bad ? "border-red-500" : ""}`}
            />
            {bad && <span className="text-xs text-red-500">Couldn&apos;t read that color.</span>}
          </label>

          {(["r", "g", "b"] as const).map((k) => (
            <label key={k} className="flex items-center gap-3 text-sm">
              <span className="w-4 uppercase font-mono text-muted-foreground">{k}</span>
              <input
                type="range"
                min={0}
                max={255}
                value={rgb[k]}
                onChange={(e) => set({ ...rgb, [k]: Number(e.target.value) })}
                className="flex-1"
                aria-label={`${k.toUpperCase()} channel`}
              />
              <span className="w-8 text-right font-mono tabular-nums">{rgb[k]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card px-4">
        {formats.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-mono text-sm break-all">{value}</p>
            </div>
            <CopyButton value={value} label="" className="px-2" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          ["White text", "#ffffff", white],
          ["Black text", "#000000", black],
        ].map(([label, fg, ratio]) => (
          <div key={label as string} className="rounded-xl border overflow-hidden">
            <div className="px-4 py-5 text-center font-medium" style={{ background: hex, color: fg as string }}>
              Sample text
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-xs">
              <span className="text-muted-foreground">{label as string}</span>
              <span className="flex items-center gap-2 font-mono">
                {(ratio as number).toFixed(2)}:1 <Grade ratio={ratio as number} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
