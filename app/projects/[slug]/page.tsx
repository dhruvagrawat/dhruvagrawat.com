/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { DATA } from "@/data/resume"
import { personRef } from "@/lib/person"
import { allProjects, getProjectBySlug, projectExtras, projectYear } from "@/content/projects"
import { Markdown } from "@/components/writing/markdown"
import { ProjectMetaLine, TechList, accentStyle, projectLinks } from "@/components/project/project-ui"

export const dynamicParams = false

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProjectBySlug((await params).slug)
  if (!p) return {}
  return {
    title: `${p.title} — Project`,
    description: p.description,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.title, description: p.description, ...(p.coverImage ? { images: [p.coverImage] } : {}) },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProjectBySlug((await params).slug)
  if (!p) notFound()

  const Extra = projectExtras[p.slug] ? (await projectExtras[p.slug]()).default : null
  const links = projectLinks(p)
  const i = allProjects.indexOf(p)
  const next = allProjects[(i + 1) % allProjects.length]
  const facts = [
    ["Role", p.role],
    ["Client", p.client],
    ["Year", projectYear(p)],
    ["Team", p.teamSize ? (p.teamSize === 1 ? "Solo" : `${p.teamSize} people`) : undefined],
  ].filter((f): f is [string, string] => Boolean(f[1]))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.description,
    url: `${DATA.url}/projects/${p.slug}`,
    author: personRef,
    keywords: p.technologies.join(", "),
    ...(p.startDate ? { dateCreated: p.startDate } : {}),
    ...(p.coverImage ? { image: `${DATA.url}${p.coverImage}` } : {}),
  }

  return (
    <article className="mx-auto max-w-4xl px-1 pt-4 sm:px-4" style={accentStyle(p)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <Link href="/projects" className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <header>
        <ProjectMetaLine p={p} />
        <h1 className="mt-4 text-5xl leading-[0.95] sm:text-7xl">{p.title}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">{p.description}</p>

        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {links.map((l, j) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  j === 0
                    ? "bg-[var(--accent-project)] text-white hover:opacity-90"
                    : "border hover:bg-muted"
                }`}
              >
                {l.label}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        )}
      </header>

      {p.coverImage && (
        <img
          src={p.coverImage}
          alt={`Screenshot of ${p.title}`}
          className="mt-12 aspect-[16/9] w-full rounded-3xl border bg-muted object-cover shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)]"
        />
      )}

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_15rem]">
        <div className="min-w-0 space-y-10">
          {p.highlights && p.highlights.length > 0 && (
            <section aria-labelledby="highlights">
              <h2 id="highlights" className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Highlights
              </h2>
              <ul className="space-y-3">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-lg leading-relaxed">
                    <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-[var(--accent-project)]" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.details && (
            <Markdown
              source={p.details}
              className="prose prose-lg max-w-none text-foreground dark:prose-invert prose-p:text-foreground/85 prose-li:text-foreground/85 prose-headings:font-display prose-headings:font-normal prose-a:text-[var(--accent-project)]"
            />
          )}

          {Extra && <Extra />}

          {!p.highlights?.length && !p.details && !Extra && (
            <p className="text-muted-foreground">A full write-up for this project is coming soon.</p>
          )}
        </div>

        <aside className="space-y-8 md:border-l md:pl-8">
          {facts.length > 0 && (
            <dl className="space-y-4 text-sm">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{k}</dt>
                  <dd className="mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Built with</p>
            <TechList items={p.technologies} />
          </div>
        </aside>
      </div>

      {p.galleryUrls && p.galleryUrls.length > 0 && (
        <section aria-label="Screenshots" className="mt-16 grid gap-4 sm:grid-cols-2">
          {p.galleryUrls.map((url, j) => (
            <img key={url} src={url} alt={`${p.title}, screenshot ${j + 1}`} loading="lazy" className="w-full rounded-2xl border bg-muted" />
          ))}
        </section>
      )}

      {next && next.slug !== p.slug && (
        <Link href={`/projects/${next.slug}`} className="group mt-24 block border-t pt-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Next project</span>
          <span className="mt-2 flex items-center gap-2 font-display text-3xl sm:text-4xl">
            {next.title}
            <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </span>
        </Link>
      )}
    </article>
  )
}
