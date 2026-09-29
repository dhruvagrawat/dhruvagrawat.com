/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react"
import { DATA } from "@/data/resume"
import { seoTitle } from "@/lib/seo"
import { getPlace, isIndexable, publishedPlaces } from "@/content/travel/places"
import { Markdown } from "@/components/travel/markdown"
import { LocatorGlobe } from "@/components/travel/locator-globe"
import { StatusBadge } from "@/components/travel/explorer"
import { CurtainImage, Rise } from "@/components/summit/motion"

export function generateStaticParams() {
  return publishedPlaces.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = getPlace(slug)
  if (!p) return {}
  const title =
    p.status === "wishlist" ? `${p.name}, ${p.country} — On My Travel Wishlist` : `${p.name}, ${p.country} — Travel Journal & Tips`
  return {
    title: seoTitle(title),
    description: p.summary,
    alternates: { canonical: `/travel/${p.slug}` },
    openGraph: {
      title,
      description: p.summary,
      url: `/travel/${p.slug}`,
      type: "article",
      ...(p.cover ? { images: [{ url: p.cover.src, alt: p.cover.alt }] } : {}),
    },
    ...(!isIndexable(p) ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getPlace(slug)
  if (!p) notFound()

  const idx = publishedPlaces.findIndex((x) => x.slug === p.slug)
  const prev = publishedPlaces[(idx - 1 + publishedPlaces.length) % publishedPlaces.length]
  const next = publishedPlaces[(idx + 1) % publishedPlaces.length]

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: `${p.name}, ${p.country}`,
        description: p.summary,
        url: `${DATA.url}/travel/${p.slug}`,
        mainEntityOfPage: `${DATA.url}/travel/${p.slug}`,
        datePublished: p.updated,
        dateModified: p.updated,
        author: { "@type": "Person", name: DATA.name, url: DATA.url },
        ...(p.cover ? { image: `${DATA.url}${p.cover.src}` } : {}),
        about: {
          "@type": "TouristDestination",
          name: p.name,
          address: { "@type": "PostalAddress", addressRegion: p.region, addressCountry: p.countryCode },
          geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
        },
        keywords: p.tags?.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: DATA.url },
          { "@type": "ListItem", position: 2, name: "Travel", item: `${DATA.url}/travel` },
          { "@type": "ListItem", position: 3, name: p.name, item: `${DATA.url}/travel/${p.slug}` },
        ],
      },
    ],
  }

  return (
    <article className="mx-auto max-w-6xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/travel" className="inline-flex items-center gap-1.5 hover:text-foreground">
          <ArrowLeft className="size-4" /> Travel journal
        </Link>
      </nav>

      <header className="mb-10 max-w-4xl">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <StatusBadge status={p.status} />
          {p.when && <span className="rounded-full border px-2.5 py-0.5 text-muted-foreground">{p.when}</span>}
          {p.draft && <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-amber-700 dark:text-amber-400">Draft — only visible locally</span>}
        </div>
        <h1 className="text-5xl leading-[0.95] sm:text-7xl">{p.name}</h1>
        <p className="mt-3 flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <MapPin className="size-3.5" /> {p.region}, {p.country}
        </p>
        <p className="mt-5 max-w-2xl text-xl leading-relaxed text-foreground/85">{p.summary}</p>
      </header>

      {p.cover && (
        <CurtainImage src={p.cover.src} alt={p.cover.alt} className="mb-14 aspect-[16/9] rounded-3xl sm:aspect-[21/9]" />
      )}

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          {p.story ? (
            <Markdown
              source={p.story}
              className="prose prose-lg max-w-none text-foreground prose-headings:font-display prose-headings:font-normal prose-headings:text-foreground prose-h2:text-4xl prose-p:text-foreground/85 prose-a:text-primary prose-strong:text-foreground prose-li:text-foreground/85 prose-figcaption:text-muted-foreground dark:prose-invert"
            />
          ) : (
            <p className="text-muted-foreground">The story for this place is still being written.</p>
          )}

          {p.gallery && p.gallery.length > 0 && (
            <section aria-label="Photos" className="mt-14 grid gap-4 sm:grid-cols-2">
              {p.gallery.map((g, i) => (
                <Rise key={g.src} delay={i * 0.05} className={i === 0 ? "sm:col-span-2" : ""}>
                  <figure>
                    <img
                      src={g.src}
                      alt={g.alt}
                      loading="lazy"
                      className={`w-full rounded-2xl object-cover ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                      style={{ filter: "var(--photo-filter)" }}
                    />
                    {g.caption && (
                      <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{g.caption}</figcaption>
                    )}
                  </figure>
                </Rise>
              ))}
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-10 lg:self-start">
          <div className="rounded-3xl border bg-card p-5">
            <LocatorGlobe lat={p.lat} lng={p.lng} country={p.country} label={p.name} />
            <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
              {Math.abs(p.lat).toFixed(3)}°{p.lat >= 0 ? "N" : "S"}, {Math.abs(p.lng).toFixed(3)}°{p.lng >= 0 ? "E" : "W"}
            </p>
          </div>

          {p.facts && p.facts.length > 0 && (
            <dl className="rounded-3xl border bg-card p-5 text-sm">
              {p.facts.map((f) => (
                <div key={f.label} className="border-b py-2.5 first:pt-0 last:border-0 last:pb-0">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{f.label}</dt>
                  <dd className="mt-0.5">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {p.tips && p.tips.length > 0 && (
            <div className="rounded-3xl border bg-card p-5 text-sm">
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Tips</h2>
              <ul className="list-disc space-y-1.5 pl-4">
                {p.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {p.tags && p.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {p.tags.map((t) => (
                <li key={t} className="rounded-full border px-3 py-1 font-mono text-[11px] text-muted-foreground">#{t}</li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {publishedPlaces.length > 1 && (
        <nav aria-label="More places" className="mt-20 grid gap-4 border-t pt-8 sm:grid-cols-2">
          <Link href={`/travel/${prev.slug}`} className="group rounded-2xl border bg-card p-5 hover:border-primary/40">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ArrowLeft className="size-3.5" /> Previous</span>
            <span className="mt-1 block font-display text-2xl">{prev.name}</span>
          </Link>
          <Link href={`/travel/${next.slug}`} className="group rounded-2xl border bg-card p-5 text-right hover:border-primary/40">
            <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">Next <ArrowRight className="size-3.5" /></span>
            <span className="mt-1 block font-display text-2xl">{next.name}</span>
          </Link>
        </nav>
      )}
    </article>
  )
}
