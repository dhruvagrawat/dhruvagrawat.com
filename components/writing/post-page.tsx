/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { DATA } from "@/data/resume"
import { personRef } from "@/lib/person"
import { seoTitle } from "@/lib/seo"
import { headingsOf, wordCount } from "./markdown"
import { CopyLink, ReadingProgress, Toc } from "./post-client"

export type PostKind = "blog" | "article"

export interface PostLike {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  tags: string[]
  readTime: number
  coverImage?: string
  category?: string
  body?: string
}

export const KIND = {
  blog: { base: "/blogs", label: "Blog", plural: "Blogs", schema: "BlogPosting" },
  article: { base: "/articles", label: "Article", plural: "Articles", schema: "Article" },
} as const

/** Covers still pointing at the template's placeholder aren't real photos. */
export const realCover = (src?: string) => (src && !src.includes("placeholder") ? src : undefined)

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })

export function postMetadata(kind: PostKind, p: PostLike): Metadata {
  const url = `${KIND[kind].base}/${p.slug}`
  const cover = realCover(p.coverImage)
  return {
    title: seoTitle(p.title),
    description: p.description,
    keywords: p.tags,
    authors: [{ name: DATA.name, url: `${DATA.url}/about` }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: p.title,
      description: p.description,
      publishedTime: p.date,
      modifiedTime: p.updated ?? p.date,
      authors: [DATA.name],
      tags: p.tags,
      ...(cover ? { images: [{ url: cover, alt: p.title }] } : {}),
    },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, creator: "@DhruvAgrawat" },
  }
}

function related(p: PostLike, all: PostLike[]) {
  const tags = new Set(p.tags.map((t) => t.toLowerCase()))
  return all
    .filter((x) => x.slug !== p.slug)
    .map((x) => ({ x, score: x.tags.filter((t) => tags.has(t.toLowerCase())).length }))
    .sort((a, b) => b.score - a.score || +new Date(b.x.date) - +new Date(a.x.date))
    .slice(0, 3)
    .map((r) => r.x)
}

export function PostPage({
  kind,
  post,
  all,
  children,
}: {
  kind: PostKind
  post: PostLike
  all: PostLike[]
  children: React.ReactNode
}) {
  const k = KIND[kind]
  const url = `${DATA.url}${k.base}/${post.slug}`
  const toc = post.body ? headingsOf(post.body) : []
  const cover = realCover(post.coverImage)
  const idx = all.findIndex((x) => x.slug === post.slug)
  const newer = idx > 0 ? all[idx - 1] : undefined
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined
  const shareText = encodeURIComponent(`${post.title} — ${DATA.name}`)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": k.schema,
        "@id": `${url}#post`,
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: "en-IN",
        author: personRef,
        publisher: personRef,
        keywords: post.tags.join(", "),
        ...(post.category ? { articleSection: post.category } : {}),
        ...(post.body ? { wordCount: wordCount(post.body) } : {}),
        ...(cover ? { image: `${DATA.url}${cover}` } : { image: `${DATA.url}${k.base}/${post.slug}/opengraph-image` }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: DATA.url },
          { "@type": "ListItem", position: 2, name: k.plural, item: `${DATA.url}${k.base}` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  }

  return (
    <div className="mx-auto max-w-6xl">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden>/</span>
        <Link href={k.base} className="hover:text-foreground">{k.plural}</Link>
      </nav>

      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {post.category && <span className="text-primary">{post.category}</span>}
          <time dateTime={post.date}>{fmtDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readTime} min read</span>
        </p>
        <h1 className="text-4xl leading-[1.02] text-balance sm:text-6xl">{post.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">{post.description}</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <img src={`${DATA.avatarUrl}?size=80`} alt="" width={40} height={40} className="size-10 rounded-full bg-muted object-cover ring-1 ring-border" />
          <div className="text-left text-sm">
            <p className="font-semibold">
              <Link href="/about" rel="author" className="hover:underline">{DATA.name}</Link>
            </p>
            <p className="text-muted-foreground">
              {post.updated && post.updated !== post.date ? <>Updated <time dateTime={post.updated}>{fmtDate(post.updated)}</time></> : "Full-stack engineer, New Delhi"}
            </p>
          </div>
        </div>
      </header>

      {cover && (
        <figure className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl">
          <img src={cover} alt={post.title} className="aspect-[2/1] w-full object-cover" />
        </figure>
      )}

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,42rem)_minmax(0,1fr)]">
        <div className="hidden lg:block" />
        <div
          className="prose prose-lg max-w-none text-foreground dark:prose-invert
            prose-headings:font-display prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-foreground
            prose-h2:mt-14 prose-h2:text-[2.1rem] prose-h2:leading-tight prose-h3:text-2xl
            prose-p:text-foreground/85 prose-li:text-foreground/85 prose-strong:text-foreground
            prose-a:text-primary prose-a:underline-offset-4 prose-blockquote:border-primary prose-blockquote:font-display prose-blockquote:text-2xl prose-blockquote:font-normal prose-blockquote:not-italic
            prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none"
        >
          {children}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-10">
            <Toc items={toc} />
          </div>
        </aside>
      </div>

      <footer className="mx-auto mt-16 max-w-2xl space-y-10">
        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t}>
                <Link href={`${k.base}?tag=${encodeURIComponent(t)}`} className="rounded-full border px-3 py-1 font-mono text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground">
                  #{t}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="mr-1 text-muted-foreground">Share</span>
          <a className="rounded-full border px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer" href={`https://x.com/intent/post?text=${shareText}&url=${encodeURIComponent(url)}`}>X</a>
          <a className="rounded-full border px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>LinkedIn</a>
          <a className="rounded-full border px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(url)}`}>WhatsApp</a>
          <CopyLink />
        </div>

        <section aria-label="About the author" className="flex gap-4 rounded-3xl border bg-card p-6">
          <img src={`${DATA.avatarUrl}?size=120`} alt="" width={56} height={56} className="size-14 shrink-0 rounded-full bg-muted object-cover" />
          <div className="text-sm">
            <p className="font-display text-xl">Written by <Link href="/about" rel="author" className="hover:underline">{DATA.name}</Link></p>
            <p className="mt-1 text-muted-foreground">
              Full-stack software engineer, freelancer and co-founder of the web agency Quadcydle, based in New Delhi. I build web products with React, Next.js and Node.js, and spend my time off trekking in the Himalayas.
            </p>
            <p className="mt-3 flex flex-wrap gap-4">
              <Link href="/about" className="font-medium text-primary hover:underline">More about me</Link>
              <a href={`mailto:${DATA.contact.email}`} className="font-medium text-primary hover:underline">Email me</a>
              <a href={DATA.contact.social.X.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Follow on X</a>
            </p>
          </div>
        </section>

        {(newer || older) && (
          <nav aria-label={`More ${k.plural.toLowerCase()}`} className="grid gap-3 sm:grid-cols-2">
            {older ? (
              <Link href={`${k.base}/${older.slug}`} className="rounded-2xl border bg-card p-5 hover:border-primary/40">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ArrowLeft className="size-3.5" /> Older</span>
                <span className="mt-1 block font-display text-xl leading-snug">{older.title}</span>
              </Link>
            ) : <span />}
            {newer && (
              <Link href={`${k.base}/${newer.slug}`} className="rounded-2xl border bg-card p-5 text-right hover:border-primary/40">
                <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">Newer <ArrowRight className="size-3.5" /></span>
                <span className="mt-1 block font-display text-xl leading-snug">{newer.title}</span>
              </Link>
            )}
          </nav>
        )}
      </footer>

      <section aria-labelledby="related" className="mt-24 border-t pt-12">
        <h2 id="related" className="mb-8 font-display text-3xl">Keep reading</h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {related(post, all).map((r) => (
            <li key={r.slug}>
              <Link href={`${k.base}/${r.slug}`} className="group block h-full rounded-3xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{r.category ?? r.tags[0]}</p>
                <h3 className="mt-2 flex items-start gap-1 font-display text-2xl leading-snug">
                  {r.title}
                  <ArrowUpRight className="mt-1 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
