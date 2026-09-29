/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next"
import { seoTitle } from "@/lib/seo"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { DATA } from "@/data/resume"
import { personRef } from "@/lib/person"
import { publishedPlaces } from "@/content/travel/places"
import { TravelExplorer, StatusBadge } from "@/components/travel/explorer"

const title = "Travel Journal — Places I've Been & Places I Want to Go"
const description =
  "Dhruv Agrawat's travel journal on an interactive 3D globe: stories, tips and photos from Himalayan treks and trips, plus a wishlist of places to go next."

export const metadata: Metadata = {
  title: seoTitle(title),
  description,
  alternates: { canonical: "/travel" },
  openGraph: { title, description, url: "/travel" },
}

export default function TravelPage() {
  const places = publishedPlaces
  const visited = places.filter((p) => p.status === "visited")
  const countries = new Set(visited.map((p) => p.countryCode)).size

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${DATA.url}/travel`,
    author: personRef,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: places.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${DATA.url}/travel/${p.slug}`,
        name: p.name,
      })),
    },
  }

  return (
    <div className="mx-auto max-w-6xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className="mb-10 max-w-3xl">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Travel journal</p>
        <h1 className="text-5xl leading-[0.95] sm:text-7xl">
          Places I&apos;ve been, <span className="italic">and places I&apos;m going.</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          A living map of my trips — stories, tips and photos from the road, and a wishlist I&apos;m slowly working through.
        </p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div><dt className="inline text-muted-foreground">Places visited </dt><dd className="inline font-semibold">{visited.length}</dd></div>
          <div><dt className="inline text-muted-foreground">Countries </dt><dd className="inline font-semibold">{countries}</dd></div>
          <div><dt className="inline text-muted-foreground">On the wishlist </dt><dd className="inline font-semibold">{places.length - visited.length}</dd></div>
        </dl>
      </header>

      <TravelExplorer places={places} />

      {/* every entry as a plain link grid — readable without JavaScript and easy for search engines */}
      <section aria-labelledby="entries-title" className="mt-24">
        <h2 id="entries-title" className="mb-6 font-display text-4xl">All entries</h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <li key={p.slug}>
              <Link href={`/travel/${p.slug}`} className="group block h-full overflow-hidden rounded-3xl border bg-card transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.4)]">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {p.cover ? (
                    <img
                      src={p.cover.src}
                      alt={p.cover.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: "var(--photo-filter)" }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-6xl text-muted-foreground/40">{p.name[0]}</div>
                  )}
                </div>
                <div className="space-y-2 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <StatusBadge status={p.status} />
                    {p.draft && <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-amber-700 dark:text-amber-400">Draft</span>}
                  </div>
                  <h3 className="flex items-center gap-1 font-display text-2xl">
                    {p.name}
                    <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="text-sm text-muted-foreground">{p.summary}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {p.region}, {p.country}{p.when ? ` · ${p.when}` : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
