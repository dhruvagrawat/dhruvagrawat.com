"use client"

import { useMemo, useState } from "react"
import { SliderField, SplitBar, Stat, Segmented, inr, inWords } from "@/components/tools/calc-ui"

type TenureUnit = "years" | "months"

export default function EmiCalculatorPage() {
  const [amount, setAmount] = useState(2_500_000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)
  const [unit, setUnit] = useState<TenureUnit>("years")

  const r = useMemo(() => {
    const n = Math.max(1, Math.round(unit === "years" ? tenure * 12 : tenure))
    const i = rate / 12 / 100
    const emi = i === 0 ? amount / n : (amount * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
    const total = emi * n
    const interest = total - amount

    // yearly amortization
    const rows: { year: number; principal: number; interest: number; balance: number }[] = []
    let bal = amount
    for (let m = 1; m <= n; m++) {
      const int = bal * i
      const prin = Math.min(bal, emi - int)
      bal = Math.max(0, bal - prin)
      const y = Math.ceil(m / 12)
      if (!rows[y - 1]) rows[y - 1] = { year: y, principal: 0, interest: 0, balance: 0 }
      rows[y - 1].principal += prin
      rows[y - 1].interest += int
      rows[y - 1].balance = bal
    }
    return { n, emi, total, interest, rows }
  }, [amount, rate, tenure, unit])

  const valid = amount > 0 && rate >= 0 && tenure > 0

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-6">
        <SliderField
          label="Loan amount"
          prefix="₹"
          value={amount}
          onChange={setAmount}
          min={10_000}
          max={20_000_000}
          step={10_000}
          hint={inWords(amount) ? `≈ ₹${inWords(amount)}` : undefined}
        />
        <SliderField label="Interest rate (p.a.)" suffix="%" value={rate} onChange={setRate} min={1} max={30} step={0.05} />
        <div className="space-y-3">
          <SliderField
            label="Loan tenure"
            suffix={unit === "years" ? "yrs" : "mo"}
            value={tenure}
            onChange={setTenure}
            min={1}
            max={unit === "years" ? 30 : 360}
            step={1}
          />
          <Segmented
            label="Tenure unit"
            value={unit}
            onChange={(u) => {
              setTenure((t) => (u === "months" ? Math.round(t * 12) : Math.max(1, Math.round(t / 12))))
              setUnit(u)
            }}
            options={[
              { value: "years", label: "Years" },
              { value: "months", label: "Months" },
            ]}
          />
        </div>
      </div>

      {valid && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat emphasis label="Monthly EMI" value={inr(r.emi)} sub={`for ${r.n} months`} />
            <Stat label="Total interest" value={inr(r.interest)} sub={inWords(r.interest) && `≈ ₹${inWords(r.interest)}`} />
            <Stat label="Total payment" value={inr(r.total)} sub={inWords(r.total) && `≈ ₹${inWords(r.total)}`} />
          </div>

          <div className="rounded-xl border bg-card p-4">
            <SplitBar a={amount} b={r.interest} aLabel="Principal" bLabel="Interest" />
          </div>

          <details className="rounded-xl border bg-card" open={r.rows.length <= 10}>
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
              Year-by-year amortization ({r.rows.length} {r.rows.length === 1 ? "year" : "years"})
            </summary>
            <div className="overflow-x-auto border-t">
              <table className="w-full text-sm tabular-nums">
                <thead className="text-xs text-muted-foreground">
                  <tr className="text-right">
                    <th className="px-4 py-2 text-left font-medium">Year</th>
                    <th className="px-4 py-2 font-medium">Principal</th>
                    <th className="px-4 py-2 font-medium">Interest</th>
                    <th className="px-4 py-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {r.rows.map((row) => (
                    <tr key={row.year} className="border-t text-right">
                      <td className="px-4 py-2 text-left">{row.year}</td>
                      <td className="px-4 py-2">{inr(row.principal)}</td>
                      <td className="px-4 py-2">{inr(row.interest)}</td>
                      <td className="px-4 py-2">{inr(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </div>
  )
}
