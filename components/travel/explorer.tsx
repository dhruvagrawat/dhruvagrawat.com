"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, MapPin, X } from "lucide-react"
import type { Place, PlaceStatus } from "@/content/travel/places"
import { Globe, type GlobeHandle } from "./globe"

type Filter = "all" | PlaceStatus

export function TravelExplorer({ places }: { places: Place[] }) {
  const globe = useRef<GlobeHandle>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const [selected, setSelected] = useState<string | null>(null)

  const shown = useMemo(() => places.filter((p) => filter === "all" || p.status === filter), [places, filter])
  const current = places.find((p) => p.slug === selected) ?? null

  const select = (slug: string) => {
    const p = places.find((x) => x.slug === slug)
    if (!p) return
    setSelected(slug)
    globe.current?.flyTo(p)
  }

  const counts = {
    all: places.length,
    visited: places.filter((p) => p.status === "visited").length,
    wishlist: places.filter((p) => p.status === "wishlist").length,
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="relative mx-auto w-full max-w-[640px]">
        <Globe ref={globe} places={shown} selected={selected} onSelect={select} />
        <p className="mt-2 text-center text-xs text-muted-foreground">Drag to spin · click a pin to fly there</p>
      </div>

      <div className="space-y-5 lg:sticky lg:top-10">
        {/* filters */}
        <div className="inline-flex rounded-full border bg-card p-1" role="radiogroup" aria-label="Show places">
          {(
            [
              ["all", "All"],
              ["visited", "Been there"],
              ["wishlist", "Want to go"],
            ] as [Filter, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              role="radio"
              aria-checked={filter === v}
              onClick={() => setFilter(v)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
                filter === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v !== "all" && (
                <span
                  className={`size-2.5 rounded-full ${
                    v === "visited" ? "bg-primary" : "border-2 border-[oklch(0.75_0.14_75)]"
                  }`}
                />
              )}
              {label}
              <span className="text-xs opacity-60">{counts[v]}</span>
            </button>
          ))}
        </div>

        {/* selected place card */}
        <AnimatePresence mode="wait">
          {current ? (
            <motion.article
              key={current.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-3xl border bg-card shadow-[0_24px_60px_-35px_rgba(0,0,0,0.4)]"
            >
              {current.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.cover.src} alt={current.cover.alt} className="aspect-[16/9] w-full object-cover" style={{ filter: "var(--photo-filter)" }} />
              )}
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      <MapPin className="size-3" /> {current.region}, {current.country}
                    </p>
                    <h2 className="mt-1 font-display text-3xl leading-tight">{current.name}</h2>
                  </div>
                  <button onClick={() => setSelected(null)} aria-label="Close" className="rounded-full p-1 text-muted-foreground hover:bg-muted">
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <StatusBadge status={current.status} />
                  {current.when && <span className="rounded-full border px-2.5 py-0.5 text-muted-foreground">{current.when}</span>}
                  {current.draft && <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-amber-700 dark:text-amber-400">Draft</span>}
                </div>
                <p className="text-muted-foreground">{current.summary}</p>
                <Link
                  href={`/travel/${current.slug}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  {current.status === "wishlist" ? "Read why I want to go" : "Read the story"}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.article>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-3xl border border-dashed p-6 text-sm text-muted-foreground">
              Pick a pin on the globe, or a place from the list, to open its journal entry.
            </motion.div>
          )}
        </AnimatePresence>

        {/* list — also keyboard-friendly way to reach every place */}
        <ul className="divide-y rounded-2xl border bg-card">
          {shown.map((p) => (
            <li key={p.slug}>
              <button
                onClick={() => select(p.slug)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60 ${
                  selected === p.slug ? "bg-muted/60" : ""
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`size-2.5 shrink-0 rounded-full ${
                      p.status === "visited" ? "bg-primary" : "border-2 border-[oklch(0.75_0.14_75)]"
                    }`}
                  />
                  <span>
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground"> · {p.country}</span>
                  </span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{p.when}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function StatusBadge({ status }: { status: PlaceStatus }) {
  return status === "visited" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
      <span className="size-1.5 rounded-full bg-primary" /> Been there
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.75_0.14_75/0.15)] px-2.5 py-0.5 font-medium text-[oklch(0.5_0.12_70)] dark:text-[oklch(0.82_0.12_80)]">
      <span className="size-1.5 rounded-full border border-current" /> Want to go
    </span>
  )
}
