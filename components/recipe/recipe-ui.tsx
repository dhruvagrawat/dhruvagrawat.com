"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Check, Clock, Leaf, Printer, Search, Users } from "lucide-react"
import type { RecipeMeta } from "@/content/types"

const hueFor = (cuisine?: string) =>
  cuisine?.includes("Italian") ? 25 : cuisine?.includes("Indian") ? 65 : 160

/** Typographic cover until real photos are added. */
export function RecipePlate({ r, big }: { r: RecipeMeta; big?: boolean }) {
  const h = hueFor(r.cuisine ?? r.category)
  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-5"
      style={{
        background: `radial-gradient(90% 80% at 85% 10%, oklch(0.86 0.09 ${h} / 0.7), transparent 60%), linear-gradient(155deg, oklch(0.95 0.03 ${h}), oklch(0.87 0.07 ${h + 15}))`,
      }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/55">{r.cuisine ?? r.category}</span>
      <span className={`font-display italic leading-[0.95] text-black/80 ${big ? "text-5xl sm:text-6xl" : "text-3xl"}`}>{r.title.split("(")[0].trim()}</span>
    </div>
  )
}

export function RecipeBrowser({ recipes }: { recipes: RecipeMeta[] }) {
  const cuisines = useMemo(() => ["All", ...Array.from(new Set(recipes.map((r) => r.cuisine ?? r.category)))], [recipes])
  const [cuisine, setCuisine] = useState("All")
  const [veg, setVeg] = useState(false)
  const [q, setQ] = useState("")

  const shown = recipes.filter((r) => {
    const term = q.trim().toLowerCase()
    return (
      (cuisine === "All" || (r.cuisine ?? r.category) === cuisine) &&
      (!veg || r.vegetarian) &&
      (!term || `${r.title} ${r.description} ${r.ingredients.join(" ")} ${r.tags.join(" ")}`.toLowerCase().includes(term))
    )
  })

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Cuisine">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              aria-pressed={cuisine === c}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${cuisine === c ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
          <button
            onClick={() => setVeg((v) => !v)}
            aria-pressed={veg}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors ${veg ? "border-emerald-600 bg-emerald-600 text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Leaf className="size-3.5" /> Vegetarian
          </button>
        </div>
        <label className="relative block sm:w-72">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by dish or ingredient…"
            aria-label="Search recipes"
            className="h-10 w-full rounded-full border bg-card pl-11 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>

      {shown.length === 0 && <p className="py-16 text-center text-muted-foreground">No recipe matches that yet.</p>}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r) => (
          <li key={r.slug}>
            <Link href={`/resipy/${r.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.4)]">
              <div className="aspect-[4/3] overflow-hidden">
                {r.coverImage && !r.coverImage.includes("placeholder") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.coverImage} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <RecipePlate r={r} />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="font-display text-2xl leading-snug">{r.title}</h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
                <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {r.prepTime + r.cookTime} min</span>
                  <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> Serves {r.servings}</span>
                  {r.vegetarian && <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400"><Leaf className="size-3.5" /> Veg</span>}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Tick ingredients off as you gather them. */
export function IngredientChecklist({ groups }: { groups: { title: string; items: string[] }[] }) {
  const [done, setDone] = useState<Set<string>>(new Set())
  const toggle = (k: string) =>
    setDone((s) => {
      const n = new Set(s)
      if (n.has(k)) n.delete(k)
      else n.add(k)
      return n
    })
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.title}>
          {groups.length > 1 && <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{g.title}</h3>}
          <ul className="space-y-1">
            {g.items.map((it) => {
              const k = `${g.title}:${it}`
              const on = done.has(k)
              return (
                <li key={k}>
                  <button type="button" onClick={() => toggle(k)} aria-pressed={on} className="flex w-full items-start gap-3 rounded-lg px-2 py-1.5 text-left text-[15px] transition-colors hover:bg-muted/60">
                    <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                      {on && <Check className="size-3.5" />}
                    </span>
                    <span className={on ? "text-muted-foreground line-through" : ""}>{it}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

/** Numbered method; tap a step to mark it done. */
export function Method({ steps }: { steps: { title: string; items: string[] }[] }) {
  const [done, setDone] = useState<Set<number>>(new Set())
  let n = 0
  return (
    <div className="space-y-10">
      {steps.map((s) => (
        <section key={s.title}>
          <h3 className="mb-4 font-display text-2xl">{s.title}</h3>
          <ol className="space-y-3">
            {s.items.map((it) => {
              const i = ++n
              const on = done.has(i)
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setDone((d) => { const x = new Set(d); if (x.has(i)) x.delete(i); else x.add(i); return x })}
                    className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition-colors ${on ? "bg-muted/50" : "bg-card hover:border-primary/40"}`}
                  >
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-sm transition-colors ${on ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {on ? <Check className="size-4" /> : i}
                    </span>
                    <span className={`pt-1 leading-relaxed ${on ? "text-muted-foreground" : ""}`}>{it}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}

export function PrintButton() {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) return null
  return (
    <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground print:hidden">
      <Printer className="size-3.5" /> Print recipe
    </button>
  )
}
