import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { DATA } from "@/data/resume"
import { getTool, relatedTools } from "@/lib/tools"

/** JSON-LD for a tool page: WebApplication + BreadcrumbList (+ FAQPage when there are FAQs). */
export function ToolJsonLd({ slug }: { slug: string }) {
  const t = getTool(slug)
  const url = `${DATA.url}/${t.slug}`
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebApplication",
      name: t.label,
      url,
      description: t.description,
      applicationCategory: t.category === "Developer" ? "DeveloperApplication" : "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: DATA.name, url: DATA.url },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: DATA.url },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${DATA.url}/tools` },
        { "@type": "ListItem", position: 3, name: t.label, item: url },
      ],
    },
  ]
  if (t.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: t.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    })
  }
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export function ToolBreadcrumb({ slug }: { slug: string }) {
  const t = getTool(slug)
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
      <Link href="/" className="hover:text-foreground">Home</Link>
      <ChevronRight className="size-3" aria-hidden />
      <Link href="/tools" className="hover:text-foreground">Tools</Link>
      <ChevronRight className="size-3" aria-hidden />
      <span className="text-foreground">{t.label}</span>
    </nav>
  )
}

/** FAQ + related tools, rendered under every tool. */
export function ToolExtras({ slug, className = "max-w-3xl" }: { slug: string; className?: string }) {
  const t = getTool(slug)
  const related = relatedTools(slug)
  if (!t.faq.length && !related.length) return null

  return (
    <div className={`container mx-auto px-4 pb-8 ${className}`}>
      {t.faq.length > 0 && (
        <section className="mt-12" aria-labelledby={`${slug}-faq`}>
          <h2 id={`${slug}-faq`} className="text-lg font-semibold mb-3">
            Frequently asked questions
          </h2>
          <div className="rounded-xl border bg-card divide-y">
            {t.faq.map((f) => (
              <details key={f.q} className="group px-4 py-3">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby={`${slug}-related`}>
          <h2 id={`${slug}-related`} className="text-lg font-semibold mb-3">
            More free tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((r) => {
              const Icon = r.icon
              return (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="group flex items-start gap-3 rounded-xl border bg-card p-3 hover:border-primary/40 transition-colors"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4 text-muted-foreground group-hover:text-foreground" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{r.label}</span>
                    <span className="block text-xs text-muted-foreground">{r.blurb}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

/** Full page frame for the newer tools: breadcrumb, H1, intro, the tool, then FAQ + related. */
export function ToolShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const t = getTool(slug)
  return (
    <>
      <ToolJsonLd slug={slug} />
      <div className="container mx-auto px-4 pt-10 max-w-3xl">
        <ToolBreadcrumb slug={slug} />
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t.label}</h1>
        <p className="text-muted-foreground mb-8">{t.description}</p>
        {children}
      </div>
      <ToolExtras slug={slug} />
    </>
  )
}

/**
 * A dark "app window" for pages that were designed with light-on-dark colours only,
 * so they stay readable when the site is in light mode.
 */
export function DarkPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xl">
      {children}
    </div>
  )
}

/** Layout wrapper for the original tool pages (they render their own heading). */
export function ToolLayout({
  slug,
  children,
  width,
  dark = false,
}: {
  slug: string
  children: React.ReactNode
  width?: string
  dark?: boolean
}) {
  return (
    <>
      <ToolJsonLd slug={slug} />
      {dark ? <DarkPanel>{children}</DarkPanel> : children}
      <ToolExtras slug={slug} className={width} />
    </>
  )
}
