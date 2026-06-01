import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Clock, Users, Timer } from "lucide-react"
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
              <Link href="/resipy" className="hover:text-white transition-colors">Resipy</Link>
              <span className="mx-2">/</span>
              <span className="text-white/90 truncate max-w-60">{metadata.title}</span>
            </nav>

            <Badge variant="secondary" className="mb-3 bg-white/10 text-white border-white/20">
              {metadata.category}
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
              {metadata.title}
            </h1>
            <p className="text-base md:text-lg text-white/70 mb-4 max-w-2xl line-clamp-2">
              {metadata.description}
            </p>

            <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                <Timer className="h-4 w-4" />
                <span>Prep {metadata.prepTime}m</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Cook {metadata.cookTime}m</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>Serves {metadata.servings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto grid md:grid-cols-[280px_1fr] gap-10">
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

          <div>
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <RecipeContent />
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
          <Link href="/resipy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to all recipes
          </Link>
        </div>
      </div>
    </div>
  )
}
