import { notFound } from "next/navigation"
import { allBlogs, blogRegistry } from "@/content/blogs"
import { PostPage, postMetadata } from "@/components/writing/post-page"

export function generateStaticParams() {
  return Object.keys(blogRegistry).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = blogRegistry[slug]
  if (!loader) return {}
  const { metadata } = await loader()
  return postMetadata("blog", metadata)
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = blogRegistry[slug]
  if (!loader) notFound()
  const { metadata, default: Content } = await loader()
  return (
    <PostPage kind="blog" post={metadata} all={allBlogs}>
      <Content />
    </PostPage>
  )
}
