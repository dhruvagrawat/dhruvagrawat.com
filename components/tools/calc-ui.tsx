"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

/** ₹ with Indian digit grouping (1,00,000). */
export function inr(n: number, digits = 0) {
  if (!Number.isFinite(n)) return "—"
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: digits, minimumFractionDigits: 0 })
}

/** 12,34,567 → "12.35 lakh" / "1.2 crore" — handy next to big rupee amounts. */
export function inWords(n: number) {
  if (!Number.isFinite(n) || n < 1e5) return ""
  if (n >= 1e7) return `${(n / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 2 })} crore`
  return `${(n / 1e5).toLocaleString("en-IN", { maximumFractionDigits: 2 })} lakh`
}

/** Number input + range slider pair. */
export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  prefix?: string
  suffix?: string
  hint?: string
}) {
  const id = useId()
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <div className="flex items-center rounded-md border bg-background px-2 focus-within:ring-2 focus-within:ring-ring">
          {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={Number.isFinite(value) ? value : ""}
            min={min}
            step={step}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
            className="h-8 w-28 bg-transparent text-right text-sm tabular-nums outline-none"
          />
          {suffix && <span className="pl-1 text-sm text-muted-foreground">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value || 0))}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function Stat({
  label,
  value,
  sub,
  emphasis,
  className,
}: {
  label: string
  value: string
  sub?: string
  emphasis?: boolean
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-4", emphasis && "border-primary/30 bg-primary/[0.03]", className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("font-semibold tabular-nums", emphasis ? "text-2xl" : "text-lg")}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

/** Two-part horizontal bar, e.g. principal vs interest. */
export function SplitBar({
  a,
  b,
  aLabel,
  bLabel,
}: {
  a: number
  b: number
  aLabel: string
  bLabel: string
}) {
  const total = a + b || 1
  const pa = (a / total) * 100
  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${aLabel} ${pa.toFixed(0)}%, ${bLabel} ${(100 - pa).toFixed(0)}%`}>
        <div className="h-full bg-primary" style={{ width: `${pa}%` }} />
        <div className="h-full bg-emerald-500" style={{ width: `${100 - pa}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" /> {aLabel} · {pa.toFixed(0)}%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" /> {bLabel} · {(100 - pa).toFixed(0)}%
        </span>
      </div>
    </div>
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  label: string
}) {
  return (
    <div className="inline-flex flex-wrap rounded-lg border bg-muted/40 p-1" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            value === o.value ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
