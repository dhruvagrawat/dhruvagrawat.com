import { allRecipes } from "@/content/recipes"
import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "Recipe preview"

export function generateStaticParams() {
  return allRecipes.map((r) => ({ slug: r.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const r = allRecipes.find((x) => x.slug === slug)
  return postOgImage({
    kicker: `${r?.cuisine ?? r?.category ?? "Recipe"} recipe`,
    title: r?.title ?? "Recipes",
    footer: r ? `${r.prepTime + r.cookTime} min · serves ${r.servings}` : undefined,
  })
}
