import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Clock, Users, Timer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { recipeRegistry } from "@/content/recipes"

export async function generateStaticParams() {
  return Object.keys(recipeRegistry).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = recipeRegistry[slug]
  if (!loader) return {}
  const { metadata } = await loader()
  return { title: `${metadata.title} | Resipy`, description: metadata.description }
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = recipeRegistry[slug]
  if (!loader) notFound()

  const { metadata, default: RecipeContent } = await loader()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/resipy" className="hover:text-foreground">Resipy</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{metadata.title}</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <Badge variant="secondary" className="mb-3">{metadata.category}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{metadata.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{metadata.description}</p>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 text-sm mb-6">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span><span className="font-medium">Prep</span> {metadata.prepTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span><span className="font-medium">Cook</span> {metadata.cookTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span><span className="font-medium">Serves</span> {metadata.servings}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {metadata.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
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

      <div className="max-w-3xl mx-auto grid md:grid-cols-[280px_1fr] gap-10">
        {/* Ingredients sidebar */}
        <aside>
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {metadata.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {ing}
              </li>
            ))}
          </ul>
        </aside>

        {/* Instructions (TSX component) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <RecipeContent />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
        <Link href="/resipy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to all recipes
        </Link>
      </div>
    </div>
  )
}
