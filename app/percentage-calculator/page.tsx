"use client"

import { useState } from "react"

const fmt = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("en-IN", { maximumFractionDigits: 4 }) : "—"

function Num({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-28 rounded-md border bg-background px-2 text-center tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  )
}

function Card({
  title,
  children,
  result,
  formula,
}: {
  title: string
  children: React.ReactNode
  result: string
  formula: string
}) {
  return (
    <section className="rounded-xl border bg-card p-4 space-y-3">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="flex flex-wrap items-center gap-2 text-sm">{children}</div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-t pt-3">
        <p className="text-xl font-semibold tabular-nums">{result}</p>
        <p className="font-mono text-xs text-muted-foreground">{formula}</p>
      </div>
    </section>
  )
}

export default function PercentageCalculatorPage() {
  const [a1, setA1] = useState("15")
  const [b1, setB1] = useState("2400")
  const [a2, setA2] = useState("45")
  const [b2, setB2] = useState("60")
  const [a3, setA3] = useState("80")
  const [b3, setB3] = useState("100")
  const [a4, setA4] = useState("2999")
  const [b4, setB4] = useState("20")
  const [a5, setA5] = useState("500")
  const [b5, setB5] = useState("12")

  const n = (s: string) => (s.trim() === "" ? NaN : Number(s))

  const r1 = (n(a1) / 100) * n(b1)
  const r2 = (n(a2) / n(b2)) * 100
  const r3 = ((n(b3) - n(a3)) / n(a3)) * 100
  const r4 = n(a4) * (1 - n(b4) / 100)
  const r5 = n(a5) * (1 + n(b5) / 100)

  return (
    <div className="grid gap-4">
      <Card title="What is X% of Y?" result={fmt(r1)} formula="X ÷ 100 × Y">
        What is <Num label="Percent" value={a1} onChange={setA1} /> % of <Num label="Number" value={b1} onChange={setB1} /> ?
      </Card>

      <Card title="X is what percent of Y?" result={`${fmt(r2)}%`} formula="X ÷ Y × 100">
        <Num label="Part" value={a2} onChange={setA2} /> is what % of <Num label="Whole" value={b2} onChange={setB2} /> ?
      </Card>

      <Card
        title="Percentage increase / decrease"
        result={Number.isFinite(r3) ? `${r3 >= 0 ? "+" : ""}${fmt(r3)}% ${r3 >= 0 ? "increase" : "decrease"}` : "—"}
        formula="(new − old) ÷ old × 100"
      >
        From <Num label="Old value" value={a3} onChange={setA3} /> to <Num label="New value" value={b3} onChange={setB3} />
      </Card>

      <Card
        title="Discount — price after X% off"
        result={Number.isFinite(r4) ? `${fmt(r4)} (you save ${fmt(n(a4) - r4)})` : "—"}
        formula="price × (1 − X ÷ 100)"
      >
        <Num label="Price" value={a4} onChange={setA4} /> with <Num label="Discount percent" value={b4} onChange={setB4} /> % off
      </Card>

      <Card title="Add a percentage (markup, tip, hike)" result={fmt(r5)} formula="value × (1 + X ÷ 100)">
        <Num label="Value" value={a5} onChange={setA5} /> plus <Num label="Percent to add" value={b5} onChange={setB5} /> %
      </Card>
    </div>
  )
}
