"use client"

import { useEffect, useMemo, useState } from "react"
import { CopyButton } from "@/components/tools/copy-button"

function parseTs(raw: string): { date: Date; unit: "s" | "ms" } | null {
  const s = raw.trim()
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null
  const n = Number(s)
  // 13+ digits → milliseconds, otherwise seconds
  const unit = Math.abs(n) >= 1e11 ? "ms" : "s"
  const d = new Date(unit === "ms" ? n : n * 1000)
  return isNaN(d.getTime()) ? null : { date: d, unit }
}

function relative(d: Date, now: number) {
  const diff = Math.round((d.getTime() - now) / 1000)
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const abs = Math.abs(diff)
  if (abs < 60) return rtf.format(diff, "second")
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute")
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour")
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day")
  if (abs < 86400 * 365) return rtf.format(Math.round(diff / (86400 * 30)), "month")
  return rtf.format(Math.round(diff / (86400 * 365)), "year")
}

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-sm break-all">{value}</p>
      </div>
      <CopyButton value={value} label="" className="px-2" />
    </div>
  )
}

export default function TimestampPage() {
  const [now, setNow] = useState<number | null>(null)
  const [ts, setTs] = useState("")
  const [dateStr, setDateStr] = useState("")
  const [tz, setTz] = useState("local")

  useEffect(() => {
    const t = Date.now()
    setNow(t)
    setTs(String(Math.floor(t / 1000)))
    setDateStr(toLocalInput(new Date(t)))
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const i = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(i)
  }, [])

  const parsed = useMemo(() => parseTs(ts), [ts])
  const fromDate = useMemo(() => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? null : d
  }, [dateStr])

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Current Unix timestamp</p>
          <p className="font-mono text-2xl sm:text-3xl tabular-nums">{now ? Math.floor(now / 1000) : "…"}</p>
          <p className="text-xs text-muted-foreground font-mono">{now ?? "…"} ms</p>
        </div>
        <CopyButton value={now ? String(Math.floor(now / 1000)) : ""} />
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Timestamp → date</h2>
        <input
          value={ts}
          onChange={(e) => setTs(e.target.value)}
          inputMode="numeric"
          aria-label="Unix timestamp"
          placeholder="e.g. 1700000000 or 1700000000000"
          className="h-10 w-full rounded-md border bg-background px-3 font-mono"
        />
        {ts && !parsed && <p className="text-sm text-red-500">Enter a whole number of seconds or milliseconds.</p>}
        {parsed && now && (
          <div className="rounded-xl border bg-card px-4">
            <Row label={`UTC (read as ${parsed.unit === "ms" ? "milliseconds" : "seconds"})`} value={parsed.date.toUTCString()} />
            <Row label={`Your time zone (${tz})`} value={parsed.date.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" })} />
            <Row label="ISO 8601" value={parsed.date.toISOString()} />
            <Row label="Relative" value={relative(parsed.date, now)} />
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Date → timestamp</h2>
        <input
          type="datetime-local"
          step={1}
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          aria-label="Date and time"
          className="h-10 w-full rounded-md border bg-background px-3"
        />
        <p className="text-xs text-muted-foreground">Interpreted in your time zone ({tz}).</p>
        {fromDate && (
          <div className="rounded-xl border bg-card px-4">
            <Row label="Unix timestamp (seconds)" value={String(Math.floor(fromDate.getTime() / 1000))} />
            <Row label="Milliseconds" value={String(fromDate.getTime())} />
            <Row label="ISO 8601 (UTC)" value={fromDate.toISOString()} />
          </div>
        )}
      </section>
    </div>
  )
}
