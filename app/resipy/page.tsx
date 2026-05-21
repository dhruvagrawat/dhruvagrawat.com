import { allRecipes } from "@/content/recipes"
import { RecipeGrid } from "@/components/recipe/recipe-grid"

export const metadata = {
  title: "Resipy | Dhruv Agrawat",
  description: "Recipes I cook and love — from quick weeknight dinners to weekend projects.",
}

export default function RecipePage() {
  const sorted = [...allRecipes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Resipy</h1>
      <p className="text-muted-foreground mb-4">
        Recipes I cook and love — from quick weeknight dinners to weekend projects.
      </p>

      {sorted.length === 0 ? (
        <p className="text-muted-foreground mt-8">No recipes yet — check back soon.</p>
      ) : (
        <RecipeGrid recipes={sorted} />
      )}
    </div>
  )
}
