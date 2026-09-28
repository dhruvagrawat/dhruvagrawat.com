import { allBlogs } from "@/content/blogs"
import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "Post preview"

export function generateStaticParams() {
  return allBlogs.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = allBlogs.find((x) => x.slug === slug)
  return postOgImage({
    kicker: p?.category ?? p?.tags[0] ?? "blog",
    title: p?.title ?? "Dhruv Agrawat",
    footer: p ? `${p.readTime} min read` : undefined,
  })
}
