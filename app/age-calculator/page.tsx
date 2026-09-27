"use client"

import { useEffect, useMemo, useState } from "react"
import { Stat } from "@/components/tools/calc-ui"

const iso = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
// parse yyyy-mm-dd as a *local* date (new Date("2000-01-01") would be UTC midnight)
const parse = (s: string) => {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null
}
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()

// Add whole months, clamping to the end of shorter months (31 Jan + 1 month = 28/29 Feb).
function addMonths(d: Date, n: number) {
  const y = d.getFullYear() + Math.floor((d.getMonth() + n) / 12)
  const m = (((d.getMonth() + n) % 12) + 12) % 12
  return new Date(y, m, Math.min(d.getDate(), daysInMonth(y, m)))
}

function diff(from: Date, to: Date) {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  if (addMonths(from, months) > to) months -= 1
  const anchor = addMonths(from, months)
  const d = Math.round((to.getTime() - anchor.getTime()) / 86_400_000)
  return { y: Math.floor(months / 12), m: months % 12, d }
}

function nextBirthday(dob: Date, from: Date) {
  const y = from.getFullYear()
  const make = (year: number) => {
    // 29 Feb in a non-leap year → 1 Mar
    const d = new Date(year, dob.getMonth(), dob.getDate())
    return d.getMonth() !== dob.getMonth() ? new Date(year, 2, 1) : d
  }
  let nb = make(y)
  if (nb < from) nb = make(y + 1)
  return nb
}

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState("2000-01-01")
  const [on, setOn] = useState("")

  useEffect(() => setOn(iso(new Date())), [])

  const r = useMemo(() => {
    const a = parse(dob)
    const b = parse(on)
    if (!a || !b || a > b) return null
    const { y, m, d } = diff(a, b)
    const ms = b.getTime() - a.getTime()
    const days = Math.round(ms / 86_400_000)
    const nb = nextBirthday(a, b)
    const untilNb = Math.round((nb.getTime() - b.getTime()) / 86_400_000)
    return {
      y,
      m,
      d,
      days,
      weeks: Math.floor(days / 7),
      months: y * 12 + m,
      hours: days * 24,
      nb,
      untilNb,
      turning: nb.getFullYear() - a.getFullYear(),
      weekday: a.toLocaleDateString("en-US", { weekday: "long" }),
    }
  }, [dob, on])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 rounded-xl border bg-card p-5">
        <label className="grid gap-1.5 text-sm font-medium">
          Date of birth
          <input
            type="date"
            value={dob}
            max={on || undefined}
            onChange={(e) => setDob(e.target.value)}
            className="h-10 rounded-md border bg-background px-3"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Age on
          <input type="date" value={on} onChange={(e) => setOn(e.target.value)} className="h-10 rounded-md border bg-background px-3" />
        </label>
      </div>

      {on && !r && <p className="text-sm text-red-500">The date of birth must be on or before the &ldquo;age on&rdquo; date.</p>}

      {r && (
        <>
          <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-5 text-center">
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="text-3xl sm:text-4xl font-semibold tabular-nums">
              {r.y} <span className="text-lg font-normal text-muted-foreground">years</span> {r.m}{" "}
              <span className="text-lg font-normal text-muted-foreground">months</span> {r.d}{" "}
              <span className="text-lg font-normal text-muted-foreground">days</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Born on a {r.weekday}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total months" value={r.months.toLocaleString("en-IN")} />
            <Stat label="Total weeks" value={r.weeks.toLocaleString("en-IN")} />
            <Stat label="Total days" value={r.days.toLocaleString("en-IN")} />
            <Stat label="Total hours" value={r.hours.toLocaleString("en-IN")} />
          </div>

          <div className="rounded-xl border bg-card p-4 text-sm">
            {r.untilNb === 0 ? (
              <p className="font-medium">🎂 Happy birthday! You turn {r.turning} today.</p>
            ) : (
              <p>
                Next birthday:{" "}
                <span className="font-medium">
                  {r.nb.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>{" "}
                — turning {r.turning}, in <span className="font-medium">{r.untilNb}</span> day{r.untilNb === 1 ? "" : "s"}.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
