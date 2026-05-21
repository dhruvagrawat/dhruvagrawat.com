"use client"

import { useState } from "react"
import type { RecipeMeta } from "@/content/types"
import { RecipeCard } from "./recipe-card"
import { RecipeFilter } from "./recipe-filter"

interface RecipeGridProps {
  recipes: RecipeMeta[]
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  const [filtered, setFiltered] = useState<RecipeMeta[]>(recipes)

  function handleFilterChange(filters: {
    search: string
    category: string
    ingredients: string[]
  }) {
    let result = [...recipes]

    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term)
      )
    }

    if (filters.category && filters.category !== "All") {
      result = result.filter((r) => r.category === filters.category)
    }

    if (filters.ingredients.length > 0) {
      result = result.filter((r) =>
        filters.ingredients.every((ing) =>
          r.ingredients.some((ri) => ri.toLowerCase().includes(ing.toLowerCase()))
        )
      )
    }

    setFiltered(result)
  }

  return (
    <>
      <div className="my-8">
        <RecipeFilter onFilterChange={handleFilterChange} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No recipes found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  )
}
