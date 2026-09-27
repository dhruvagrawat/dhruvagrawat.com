"use client"

import { useMemo, useState } from "react"
import { Segmented, Stat, inr } from "@/components/tools/calc-ui"
import { CopyButton } from "@/components/tools/copy-button"

type Mode = "add" | "remove"
type Supply = "intra" | "inter"

const RATES = [0.25, 3, 5, 18, 40]

export default function GstCalculatorPage() {
  const [amount, setAmount] = useState(1000)
  const [rate, setRate] = useState(18)
  const [mode, setMode] = useState<Mode>("add")
  const [supply, setSupply] = useState<Supply>("intra")

  const r = useMemo(() => {
    const base = mode === "add" ? amount : (amount * 100) / (100 + rate)
    const gst = mode === "add" ? (amount * rate) / 100 : amount - base
    return { base, gst, total: base + gst }
  }, [amount, rate, mode])

  const round2 = (n: number) => inr(n, 2)
  const summary = `Base: ${round2(r.base)}\nGST @ ${rate}%: ${round2(r.gst)}${
    supply === "intra" ? ` (CGST ${round2(r.gst / 2)} + SGST ${round2(r.gst / 2)})` : ` (IGST)`
  }\nTotal: ${round2(r.total)}`

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-5">
        <Segmented
          label="Calculation"
          value={mode}
          onChange={setMode}
          options={[
            { value: "add", label: "Add GST (exclusive → inclusive)" },
            { value: "remove", label: "Remove GST (inclusive → base)" },
          ]}
        />

        <label className="grid gap-1.5 text-sm font-medium">
          {mode === "add" ? "Price before GST" : "Price including GST"}
          <div className="flex items-center rounded-md border bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <span className="text-muted-foreground">₹</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="h-11 w-full bg-transparent px-2 text-lg tabular-nums outline-none"
            />
          </div>
        </label>

        <div className="space-y-2">
          <p className="text-sm font-medium">GST rate</p>
          <div className="flex flex-wrap items-center gap-2">
            {RATES.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setRate(x)}
                aria-pressed={rate === x}
                className={`rounded-md border px-3 py-1.5 text-sm tabular-nums transition-colors ${
                  rate === x ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {x}%
              </button>
            ))}
            <label className="flex items-center gap-1 rounded-md border px-2 text-sm">
              <span className="text-muted-foreground">Custom</span>
              <input
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="h-8 w-16 bg-transparent text-right tabular-nums outline-none"
                aria-label="Custom GST rate"
              />
              %
            </label>
          </div>
        </div>

        <Segmented
          label="Type of supply"
          value={supply}
          onChange={setSupply}
          options={[
            { value: "intra", label: "Same state (CGST + SGST)" },
            { value: "inter", label: "Other state (IGST)" },
          ]}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Base amount" value={round2(r.base)} />
        <Stat label={`GST @ ${rate}%`} value={round2(r.gst)} />
        <Stat emphasis label="Total (incl. GST)" value={round2(r.total)} />
      </div>

      <div className="rounded-xl border bg-card px-4 text-sm">
        {supply === "intra" ? (
          <>
            <div className="flex justify-between py-2.5 border-b">
              <span className="text-muted-foreground">CGST @ {rate / 2}%</span>
              <span className="tabular-nums">{round2(r.gst / 2)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-muted-foreground">SGST / UTGST @ {rate / 2}%</span>
              <span className="tabular-nums">{round2(r.gst / 2)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between py-2.5">
            <span className="text-muted-foreground">IGST @ {rate}%</span>
            <span className="tabular-nums">{round2(r.gst)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <CopyButton value={summary} label="Copy breakdown" />
      </div>
    </div>
  )
}
