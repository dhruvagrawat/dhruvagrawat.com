import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { articleRegistry } from "@/content/articles"

export async function generateStaticParams() {
  return Object.keys(articleRegistry).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = articleRegistry[slug]
  if (!loader) return {}
  const { metadata } = await loader()
  return { title: `${metadata.title} | Dhruv Agrawat`, description: metadata.description }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = articleRegistry[slug]
  if (!loader) notFound()

  const { metadata, default: ArticleContent } = await loader()

  const formattedDate = new Date(metadata.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div>
      {/* ── Full-width hero banner ── */}
      <div className="relative w-full h-[62vh] min-h-100 overflow-hidden">
        {metadata.coverImage ? (
          <Image
            src={metadata.coverImage}
            alt={metadata.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-zinc-900 to-zinc-800" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-4 pb-10 md:pb-14">
          <div className="container mx-auto max-w-4xl">
            <nav className="flex mb-4 text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/articles" className="hover:text-white transition-colors">Articles</Link>
              <span className="mx-2">/</span>
              <span className="text-white/90 truncate max-w-60">{metadata.title}</span>
            </nav>

            {metadata.publication && (
              <p className="text-sm text-primary font-medium mb-2">{metadata.publication}</p>
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
              {metadata.title}
            </h1>
            <p className="text-base md:text-lg text-white/70 mb-4 max-w-2xl line-clamp-2">
              {metadata.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{metadata.readTime} min read</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
          <ArticleContent />
        </div>

        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
          <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to all articles
          </Link>
        </div>
      </div>
    </div>
  )
}
