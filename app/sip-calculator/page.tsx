"use client"

import { useMemo, useState } from "react"
import { SliderField, SplitBar, Stat, inr, inWords } from "@/components/tools/calc-ui"

export default function SipCalculatorPage() {
  const [monthly, setMonthly] = useState(10_000)
  const [ret, setRet] = useState(12)
  const [years, setYears] = useState(15)
  const [stepUp, setStepUp] = useState(0)

  const r = useMemo(() => {
    const i = ret / 12 / 100 // monthly rate, the convention most Indian SIP calculators use
    let value = 0
    let invested = 0
    let sip = monthly
    const rows: { year: number; invested: number; value: number; sip: number }[] = []
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        value = (value + sip) * (1 + i) // invest at the start of the month
        invested += sip
      }
      rows.push({ year: y, invested, value, sip })
      sip = sip * (1 + stepUp / 100)
    }
    return { value, invested, gains: value - invested, rows }
  }, [monthly, ret, years, stepUp])

  const valid = monthly > 0 && years > 0

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-6">
        <SliderField label="Monthly investment" prefix="₹" value={monthly} onChange={setMonthly} min={500} max={500_000} step={500} />
        <SliderField label="Expected return (p.a.)" suffix="%" value={ret} onChange={setRet} min={1} max={30} step={0.5} />
        <SliderField label="Time period" suffix="yrs" value={years} onChange={setYears} min={1} max={40} />
        <SliderField
          label="Annual step-up"
          suffix="%"
          value={stepUp}
          onChange={setStepUp}
          min={0}
          max={50}
          hint="Increase your SIP by this % every year (0 for a flat SIP)."
        />
      </div>

      {valid && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat emphasis label="Estimated value" value={inr(r.value)} sub={inWords(r.value) && `≈ ₹${inWords(r.value)}`} />
            <Stat label="Amount invested" value={inr(r.invested)} sub={inWords(r.invested) && `≈ ₹${inWords(r.invested)}`} />
            <Stat label="Estimated returns" value={inr(r.gains)} sub={`${((r.value / r.invested) || 0).toFixed(2)}× your money`} />
          </div>

          <div className="rounded-xl border bg-card p-4">
            <SplitBar a={r.invested} b={Math.max(0, r.gains)} aLabel="Invested" bLabel="Returns" />
          </div>

          <details className="rounded-xl border bg-card" open={r.rows.length <= 10}>
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium">Year-by-year growth</summary>
            <div className="overflow-x-auto border-t">
              <table className="w-full text-sm tabular-nums">
                <thead className="text-xs text-muted-foreground">
                  <tr className="text-right">
                    <th className="px-4 py-2 text-left font-medium">Year</th>
                    {stepUp > 0 && <th className="px-4 py-2 font-medium">Monthly SIP</th>}
                    <th className="px-4 py-2 font-medium">Invested</th>
                    <th className="px-4 py-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {r.rows.map((row) => (
                    <tr key={row.year} className="border-t text-right">
                      <td className="px-4 py-2 text-left">{row.year}</td>
                      {stepUp > 0 && <td className="px-4 py-2">{inr(row.sip)}</td>}
                      <td className="px-4 py-2">{inr(row.invested)}</td>
                      <td className="px-4 py-2">{inr(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p className="text-xs text-muted-foreground">
            Estimates assume a constant annual return, compounded monthly. Actual mutual fund returns vary and
            aren&apos;t guaranteed. This isn&apos;t financial advice.
          </p>
        </>
      )}
    </div>
  )
}
