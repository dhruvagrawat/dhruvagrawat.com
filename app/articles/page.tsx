import type { Metadata } from "next"
import { seoTitle } from "@/lib/seo"
import { allArticles } from "@/content/articles"
import { DATA } from "@/data/resume"
import { personRef } from "@/lib/person"
import { PostList } from "@/components/writing/post-list"

const title = "Articles — Security, Running an Agency & Travelling India"
const description =
  "Long-form articles on web security, running a small tech agency and freelancing in India, and travelling through the Himalayas and India's wild places."

export const metadata: Metadata = {
  title: seoTitle(title),
  description,
  alternates: { canonical: "/articles", types: { "application/rss+xml": "/articles/rss.xml" } },
  openGraph: { title, description, url: "/articles" },
}

export default function ArticlesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${DATA.url}/articles`,
    author: personRef,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allArticles.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${DATA.url}/articles/${p.slug}`, name: p.title })),
    },
  }
  return (
    <div className="mx-auto max-w-6xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="mb-12 max-w-3xl">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Articles</p>
        <h1 className="text-5xl leading-[0.95] sm:text-7xl">
          Longer reads, <span className="italic">worth the time.</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Security, building and running an agency, freelancing in India — and the mountains, rivers and trails that keep me sane.
        </p>
      </header>
      <PostList kind="article" posts={allArticles} />
    </div>
  )
}
