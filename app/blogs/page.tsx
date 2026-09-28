import type { Metadata } from "next"
import { allBlogs } from "@/content/blogs"
import { DATA } from "@/data/resume"
import { PostList } from "@/components/writing/post-list"

const title = "Blog — Linux, Arch, Open Source & Developer Tools"
const description =
  "Hands-on posts about Linux, Arch Linux, open source, the terminal and developer tools — practical guides, cheat sheets and tricks from a full-stack engineer."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blogs", types: { "application/rss+xml": "/blogs/rss.xml" } },
  openGraph: { title, description, url: "/blogs" },
}

export default function BlogsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${DATA.name}'s blog`,
    description,
    url: `${DATA.url}/blogs`,
    author: { "@type": "Person", name: DATA.name, url: DATA.url },
    blogPost: allBlogs.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${DATA.url}/blogs/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Person", name: DATA.name },
    })),
  }
  return (
    <div className="mx-auto max-w-6xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="mb-12 max-w-3xl">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Blog</p>
        <h1 className="text-5xl leading-[0.95] sm:text-7xl">
          Notes from the <span className="italic">terminal.</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Linux, Arch, open source and the tools I use every day — written down so you (and future me) don&apos;t have to figure it out twice.
        </p>
      </header>
      <PostList kind="blog" posts={allBlogs} />
    </div>
  )
}
