"use client"

import { useMemo, useState } from "react"
import { ArrowLeftRight } from "lucide-react"
import { Segmented } from "@/components/tools/calc-ui"
import { CopyButton } from "@/components/tools/copy-button"

type Unit = { id: string; label: string; factor?: number; toBase?: (v: number) => number; fromBase?: (v: number) => number }
type Category = { id: string; label: string; units: Unit[]; from: string; to: string }

// Each factor converts 1 unit into the category's base unit (m, kg, m², L, m/s, byte).
const CATS: Category[] = [
  {
    id: "length", label: "Length", from: "cm", to: "in",
    units: [
      { id: "mm", label: "Millimetre (mm)", factor: 0.001 },
      { id: "cm", label: "Centimetre (cm)", factor: 0.01 },
      { id: "m", label: "Metre (m)", factor: 1 },
      { id: "km", label: "Kilometre (km)", factor: 1000 },
      { id: "in", label: "Inch (in)", factor: 0.0254 },
      { id: "ft", label: "Foot (ft)", factor: 0.3048 },
      { id: "yd", label: "Yard (yd)", factor: 0.9144 },
      { id: "mi", label: "Mile (mi)", factor: 1609.344 },
      { id: "nmi", label: "Nautical mile", factor: 1852 },
    ],
  },
  {
    id: "weight", label: "Weight", from: "kg", to: "lb",
    units: [
      { id: "mg", label: "Milligram (mg)", factor: 1e-6 },
      { id: "g", label: "Gram (g)", factor: 0.001 },
      { id: "kg", label: "Kilogram (kg)", factor: 1 },
      { id: "t", label: "Tonne (t)", factor: 1000 },
      { id: "quintal", label: "Quintal (q)", factor: 100 },
      { id: "oz", label: "Ounce (oz)", factor: 0.028349523125 },
      { id: "lb", label: "Pound (lb)", factor: 0.45359237 },
      { id: "st", label: "Stone (st)", factor: 6.35029318 },
      { id: "tola", label: "Tola", factor: 0.0116638038 }, // 180 grains
    ],
  },
  {
    id: "temp", label: "Temperature", from: "c", to: "f",
    units: [
      { id: "c", label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
      { id: "f", label: "Fahrenheit (°F)", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: "k", label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: "area", label: "Area", from: "sqft", to: "sqm",
    units: [
      { id: "sqcm", label: "Square centimetre", factor: 1e-4 },
      { id: "sqm", label: "Square metre (m²)", factor: 1 },
      { id: "sqft", label: "Square foot (ft²)", factor: 0.09290304 },
      { id: "sqyd", label: "Square yard (gaj)", factor: 0.83612736 },
      { id: "acre", label: "Acre", factor: 4046.8564224 },
      { id: "ha", label: "Hectare (ha)", factor: 10000 },
      { id: "sqkm", label: "Square kilometre", factor: 1e6 },
      { id: "sqmi", label: "Square mile", factor: 2589988.110336 },
    ],
  },
  {
    id: "volume", label: "Volume", from: "l", to: "usgal",
    units: [
      { id: "ml", label: "Millilitre (ml)", factor: 0.001 },
      { id: "l", label: "Litre (L)", factor: 1 },
      { id: "m3", label: "Cubic metre (m³)", factor: 1000 },
      { id: "tsp", label: "Teaspoon (US)", factor: 0.00492892159375 },
      { id: "tbsp", label: "Tablespoon (US)", factor: 0.01478676478125 },
      { id: "cup", label: "Cup (US)", factor: 0.2365882365 },
      { id: "floz", label: "Fluid ounce (US)", factor: 0.0295735295625 },
      { id: "usgal", label: "Gallon (US)", factor: 3.785411784 },
      { id: "ukgal", label: "Gallon (UK)", factor: 4.54609 },
    ],
  },
  {
    id: "speed", label: "Speed", from: "kmh", to: "mph",
    units: [
      { id: "ms", label: "Metres / second", factor: 1 },
      { id: "kmh", label: "Kilometres / hour", factor: 1 / 3.6 },
      { id: "mph", label: "Miles / hour", factor: 0.44704 },
      { id: "kn", label: "Knots", factor: 1852 / 3600 },
      { id: "fts", label: "Feet / second", factor: 0.3048 },
    ],
  },
  {
    id: "data", label: "Data", from: "mb", to: "gb",
    units: [
      { id: "bit", label: "Bit", factor: 1 / 8 },
      { id: "b", label: "Byte (B)", factor: 1 },
      { id: "kb", label: "Kilobyte (KB)", factor: 1e3 },
      { id: "mb", label: "Megabyte (MB)", factor: 1e6 },
      { id: "gb", label: "Gigabyte (GB)", factor: 1e9 },
      { id: "tb", label: "Terabyte (TB)", factor: 1e12 },
      { id: "kib", label: "Kibibyte (KiB)", factor: 1024 },
      { id: "mib", label: "Mebibyte (MiB)", factor: 1024 ** 2 },
      { id: "gib", label: "Gibibyte (GiB)", factor: 1024 ** 3 },
      { id: "tib", label: "Tebibyte (TiB)", factor: 1024 ** 4 },
    ],
  },
]

const toBase = (u: Unit, v: number) => (u.toBase ? u.toBase(v) : v * (u.factor ?? 1))
const fromBase = (u: Unit, v: number) => (u.fromBase ? u.fromBase(v) : v / (u.factor ?? 1))

function fmt(n: number) {
  if (!Number.isFinite(n)) return "—"
  if (n !== 0 && (Math.abs(n) >= 1e15 || Math.abs(n) < 1e-6)) return n.toExponential(6)
  return Number(n.toPrecision(10)).toLocaleString("en-US", { maximumFractionDigits: 8 })
}

function UnitSelect({ units, value, onChange, label }: { units: Unit[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border bg-background px-2 text-sm"
    >
      {units.map((u) => (
        <option key={u.id} value={u.id}>
          {u.label}
        </option>
      ))}
    </select>
  )
}

export default function UnitConverterPage() {
  const [catId, setCatId] = useState("length")
  const cat = CATS.find((c) => c.id === catId)!
  const [from, setFrom] = useState(cat.from)
  const [to, setTo] = useState(cat.to)
  const [value, setValue] = useState("1")

  const fromU = cat.units.find((u) => u.id === from) ?? cat.units[0]
  const toU = cat.units.find((u) => u.id === to) ?? cat.units[1]
  const v = Number(value)

  const result = useMemo(() => (value.trim() === "" ? NaN : fromBase(toU, toBase(fromU, v))), [fromU, toU, v, value])
  const all = useMemo(
    () => cat.units.map((u) => ({ u, val: value.trim() === "" ? NaN : fromBase(u, toBase(fromU, v)) })),
    [cat, fromU, v, value]
  )

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Segmented
          label="Measurement"
          value={catId}
          onChange={(id) => {
            const c = CATS.find((x) => x.id === id)!
            setCatId(id)
            setFrom(c.from)
            setTo(c.to)
          }}
          options={CATS.map((c) => ({ value: c.id, label: c.label }))}
        />
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-2">
            <input
              type="number"
              inputMode="decimal"
              aria-label="Value to convert"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-12 w-full rounded-md border bg-background px-3 text-xl tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <UnitSelect units={cat.units} value={fromU.id} onChange={setFrom} label="From unit" />
          </div>
          <button
            type="button"
            aria-label="Swap units"
            onClick={() => {
              setFrom(toU.id)
              setTo(fromU.id)
              if (Number.isFinite(result)) setValue(String(Number(result.toPrecision(10))))
            }}
            className="mx-auto mb-1 flex size-10 items-center justify-center rounded-full border hover:bg-muted"
          >
            <ArrowLeftRight className="size-4" />
          </button>
          <div className="space-y-2">
            <div className="flex h-12 items-center justify-between rounded-md border bg-muted/40 px-3">
              <span className="text-xl font-semibold tabular-nums truncate">{fmt(result)}</span>
              <CopyButton value={Number.isFinite(result) ? String(Number(result.toPrecision(10))) : ""} label="" className="px-2" />
            </div>
            <UnitSelect units={cat.units} value={toU.id} onChange={setTo} label="To unit" />
          </div>
        </div>
        {Number.isFinite(result) && (
          <p className="mt-4 text-sm text-muted-foreground">
            {fmt(v)} {fromU.label.replace(/ \(.*\)/, "").toLowerCase()} = {fmt(result)} {toU.label.replace(/ \(.*\)/, "").toLowerCase()}
          </p>
        )}
      </div>

      <div className="rounded-xl border bg-card">
        <p className="border-b px-4 py-2.5 text-sm font-medium">
          {fmt(v)} {fromU.label} in every unit
        </p>
        <div className="divide-y">
          {all.map(({ u, val }) => (
            <div key={u.id} className={`flex justify-between px-4 py-2 text-sm ${u.id === fromU.id ? "text-muted-foreground" : ""}`}>
              <span>{u.label}</span>
              <span className="font-mono tabular-nums">{fmt(val)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
