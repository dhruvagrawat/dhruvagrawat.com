"use client"

import { useMemo, useState } from "react"
import { Segmented } from "@/components/tools/calc-ui"
import { monoArea } from "@/components/tools/copy-button"

type Op = { type: "same" | "add" | "del"; a?: string; b?: string; na?: number; nb?: number }
type View = "split" | "unified"

const MAX_LINES = 5000

// Line diff via longest common subsequence (O(n·m) — fine for a few thousand lines).
function diffLines(a: string[], b: string[], norm: (s: string) => string): Op[] {
  const A = a.map(norm)
  const B = b.map(norm)
  const n = A.length
  const m = B.length
  const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  const ops: Op[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      ops.push({ type: "same", a: a[i], b: b[j], na: i + 1, nb: j + 1 })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "del", a: a[i], na: i + 1 })
      i++
    } else {
      ops.push({ type: "add", b: b[j], nb: j + 1 })
      j++
    }
  }
  while (i < n) ops.push({ type: "del", a: a[i], na: ++i })
  while (j < m) ops.push({ type: "add", b: b[j], nb: ++j })
  return ops
}

// Pair up deletions and additions so the split view shows them side by side.
function toRows(ops: Op[]) {
  const rows: { l?: Op; r?: Op }[] = []
  let k = 0
  while (k < ops.length) {
    if (ops[k].type === "same") {
      rows.push({ l: ops[k], r: ops[k] })
      k++
      continue
    }
    const dels: Op[] = []
    const adds: Op[] = []
    while (k < ops.length && ops[k].type !== "same") {
      ;(ops[k].type === "del" ? dels : adds).push(ops[k])
      k++
    }
    for (let x = 0; x < Math.max(dels.length, adds.length); x++) rows.push({ l: dels[x], r: adds[x] })
  }
  return rows
}

const cellCls = (t?: Op["type"], side?: "l" | "r") =>
  t === "del" && side === "l"
    ? "bg-red-500/10"
    : t === "add" && side === "r"
    ? "bg-emerald-500/10"
    : ""

export default function DiffCheckerPage() {
  const [left, setLeft] = useState("const greeting = 'Hello';\nconst name = 'World';\nconsole.log(greeting + ', ' + name);\n")
  const [right, setRight] = useState("const greeting = 'Hello';\nconst name = 'Dhruv';\nconsole.log(`${greeting}, ${name}!`);\nexport default greeting;\n")
  const [ignoreWs, setIgnoreWs] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [view, setView] = useState<View>("split")

  const result = useMemo(() => {
    const a = left.split("\n")
    const b = right.split("\n")
    if (a.length > MAX_LINES || b.length > MAX_LINES) return { tooBig: true as const }
    const norm = (s: string) => {
      let x = ignoreWs ? s.replace(/\s+/g, " ").trim() : s
      if (ignoreCase) x = x.toLowerCase()
      return x
    }
    const ops = diffLines(a, b, norm)
    return {
      tooBig: false as const,
      ops,
      rows: toRows(ops),
      added: ops.filter((o) => o.type === "add").length,
      removed: ops.filter((o) => o.type === "del").length,
    }
  }, [left, right, ignoreWs, ignoreCase])

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          Original
          <textarea rows={8} value={left} spellCheck={false} onChange={(e) => setLeft(e.target.value)} className={monoArea} />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Changed
          <textarea rows={8} value={right} spellCheck={false} onChange={(e) => setRight(e.target.value)} className={monoArea} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Segmented
          label="View"
          value={view}
          onChange={setView}
          options={[
            { value: "split", label: "Side by side" },
            { value: "unified", label: "Unified" },
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={ignoreWs} onChange={(e) => setIgnoreWs(e.target.checked)} /> Ignore whitespace
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} /> Ignore case
        </label>
      </div>

      {result.tooBig ? (
        <p className="text-sm text-red-500">That&apos;s over {MAX_LINES.toLocaleString()} lines — try a smaller section.</p>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="flex gap-4 border-b px-4 py-2.5 text-sm">
            <span className="text-emerald-600 dark:text-emerald-400">+{result.added} added</span>
            <span className="text-red-600 dark:text-red-400">−{result.removed} removed</span>
            {result.added === 0 && result.removed === 0 && <span className="text-muted-foreground">The texts are identical.</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[12.5px] leading-relaxed">
              <tbody>
                {view === "split"
                  ? result.rows.map((row, i) => (
                      <tr key={i} className="align-top">
                        <td className="w-10 select-none px-2 text-right text-muted-foreground/70">{row.l?.na ?? ""}</td>
                        <td className={`w-1/2 whitespace-pre-wrap break-all border-r px-2 ${cellCls(row.l?.type, "l")}`}>
                          {row.l?.type === "del" && <span className="select-none text-red-500">− </span>}
                          {row.l?.a ?? ""}
                        </td>
                        <td className="w-10 select-none px-2 text-right text-muted-foreground/70">{row.r?.nb ?? ""}</td>
                        <td className={`w-1/2 whitespace-pre-wrap break-all px-2 ${cellCls(row.r?.type, "r")}`}>
                          {row.r?.type === "add" && <span className="select-none text-emerald-600">+ </span>}
                          {row.r?.b ?? ""}
                        </td>
                      </tr>
                    ))
                  : result.ops.map((o, i) => (
                      <tr
                        key={i}
                        className={o.type === "add" ? "bg-emerald-500/10" : o.type === "del" ? "bg-red-500/10" : ""}
                      >
                        <td className="w-10 select-none px-2 text-right text-muted-foreground/70">{o.na ?? ""}</td>
                        <td className="w-10 select-none px-2 text-right text-muted-foreground/70">{o.nb ?? ""}</td>
                        <td className="whitespace-pre-wrap break-all px-2">
                          <span className="select-none text-muted-foreground">
                            {o.type === "add" ? "+ " : o.type === "del" ? "− " : "  "}
                          </span>
                          {o.type === "add" ? o.b : o.a}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
