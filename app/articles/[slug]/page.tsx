import { notFound } from "next/navigation"
import { allArticles, articleRegistry } from "@/content/articles"
import { PostPage, postMetadata } from "@/components/writing/post-page"

export function generateStaticParams() {
  return Object.keys(articleRegistry).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = articleRegistry[slug]
  if (!loader) return {}
  const { metadata } = await loader()
  return postMetadata("article", metadata)
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = articleRegistry[slug]
  if (!loader) notFound()
  const { metadata, default: Content } = await loader()
  return (
    <PostPage kind="article" post={metadata} all={allArticles}>
      <Content />
    </PostPage>
  )
}
