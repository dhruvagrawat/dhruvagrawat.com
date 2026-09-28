"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Search, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import type { PostKind, PostLike } from "./post-page"

const BASE = { blog: "/blogs", article: "/articles" } as const

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
const cover = (src?: string) => (src && !src.includes("placeholder") ? src : undefined)

/** Typographic stand-in when a post has no photo. */
function Plate({ post, big }: { post: PostLike; big?: boolean }) {
  const hue = [...post.slug].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <div
      className="relative flex h-full w-full items-end overflow-hidden p-5"
      style={{
        background: `radial-gradient(120% 90% at 100% 0%, oklch(0.8 0.06 ${hue} / 0.55), transparent 60%), linear-gradient(160deg, oklch(0.93 0.02 ${hue}), oklch(0.86 0.04 ${(hue + 40) % 360}))`,
      }}
    >
      <span className={`font-display leading-[0.9] text-black/80 ${big ? "text-6xl sm:text-7xl" : "text-4xl"}`} aria-hidden>
        {post.category ?? post.tags[0]}
      </span>
    </div>
  )
}

export function PostList({ kind, posts }: { kind: PostKind; posts: PostLike[] }) {
  const [q, setQ] = useState("")
  const [tag, setTag] = useState<string | null>(null)
  const [allTags, setAllTags] = useState(false)

  // ?tag=Linux deep links from post pages
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tag")
    if (t) setTag(t)
  }, [])

  useEffect(() => {
    const u = new URL(window.location.href)
    if (tag) u.searchParams.set("tag", tag)
    else u.searchParams.delete("tag")
    window.history.replaceState(null, "", u)
  }, [tag])

  const tags = useMemo(() => {
    const m = new Map<string, number>()
    posts.forEach((p) => p.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)))
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
  }, [posts])

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase()
    return posts.filter(
      (p) =>
        (!tag || p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) &&
        (!term || `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(term))
    )
  }, [posts, q, tag])

  const filtering = Boolean(q.trim() || tag)
  const [featured, ...rest] = shown
  const base = BASE[kind]

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4">
        <label className="relative block max-w-md">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${posts.length} ${kind === "blog" ? "posts" : "articles"}…`}
            aria-label="Search"
            className="h-11 w-full rounded-full border bg-card pl-11 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <button
            onClick={() => setTag(null)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${!tag ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
          >
            All
          </button>
          {(allTags ? tags : tags.slice(0, 10).concat(tag && !tags.slice(0, 10).includes(tag) ? [tag] : [])).map((t) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? null : t)}
              aria-pressed={tag === t}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${tag === t ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
          {tags.length > 10 && (
            <button
              onClick={() => setAllTags((v) => !v)}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-primary hover:underline"
            >
              {allTags ? "Fewer tags" : `+${tags.length - 10} more`}
            </button>
          )}
        </div>
        {filtering && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {shown.length} result{shown.length === 1 ? "" : "s"}
            <button onClick={() => { setQ(""); setTag(null) }} className="inline-flex items-center gap-1 text-foreground hover:underline">
              <X className="size-3.5" /> clear
            </button>
          </p>
        )}
      </div>

      {shown.length === 0 && <p className="py-16 text-center text-muted-foreground">Nothing matches that — try another word or tag.</p>}

      {featured && (
        <Link
          href={`${base}/${featured.slug}`}
          className="group mb-8 grid overflow-hidden rounded-3xl border bg-card transition-shadow hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.45)] md:grid-cols-[1.1fr_1fr]"
        >
          <div className="aspect-[16/10] md:aspect-auto md:min-h-[22rem]">
            {cover(featured.coverImage) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover(featured.coverImage)} alt="" className="h-full w-full object-cover" />
            ) : (
              <Plate post={featured} big />
            )}
          </div>
          <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {filtering ? "Top result" : "Latest"} · {fmt(featured.date)} · {featured.readTime} min
            </p>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">{featured.title}</h2>
            <p className="text-muted-foreground">{featured.description}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Read it <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      )}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {rest.map((p) => (
            <motion.li key={p.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Link href={`${base}/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.4)]">
                <div className="aspect-[16/9]">
                  {cover(p.coverImage) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover(p.coverImage)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <Plate post={p} />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {fmt(p.date)} · {p.readTime} min
                  </p>
                  <h3 className="font-display text-2xl leading-snug">{p.title}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-3">
                    {p.tags.slice(0, 3).map((t) => (
                      <li key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">{t}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
