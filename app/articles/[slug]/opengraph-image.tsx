import { allArticles } from "@/content/articles"
import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "Post preview"

export function generateStaticParams() {
  return allArticles.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = allArticles.find((x) => x.slug === slug)
  return postOgImage({
    kicker: p?.category ?? p?.tags[0] ?? "article",
    title: p?.title ?? "Dhruv Agrawat",
    footer: p ? `${p.readTime} min read` : undefined,
  })
}
