import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Clock, Calendar } from "lucide-react"
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
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/articles" className="hover:text-foreground">Articles</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{metadata.title}</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        {metadata.publication && (
          <p className="text-sm text-primary font-medium mb-2">{metadata.publication}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{metadata.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{metadata.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{metadata.readTime} min read</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {metadata.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Cover image */}
      {metadata.coverImage && (
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={metadata.coverImage}
              alt={metadata.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Article content (TSX component) */}
      <div className="max-w-3xl mx-auto">
        <ArticleContent />
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
        <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to all articles
        </Link>
      </div>
    </div>
  )
}
