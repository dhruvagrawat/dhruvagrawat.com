"use client"

import { useState, useEffect } from "react"
import type { Recipe } from "@/lib/types"

import { RecipeCarousel } from "@/components/recipe/recipe-carousel"
import { RecipeFilter } from "@/components/recipe/recipe-filter"
import { RecipeCard } from "@/components/recipe/recipe-card"

// All data fetched from Supabase via API

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        console.log("[v0] Fetching recipes from API...")
        const res = await fetch("/api/recipes")
        if (res.ok) {
          const data = await res.json()
          console.log("[v0] Recipes fetched:", data)
          setRecipes(data)
          setFilteredRecipes(data)
        } else {
          console.error("[v0] API error:", res.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching recipes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const handleFilterChange = (filters: {
    search: string
    category: string
    ingredients: string[]
  }) => {
    let filtered = [...recipes]

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm) || recipe.description.toLowerCase().includes(searchTerm),
      )
    }

    // Filter by category
    if (filters.category && filters.category !== "All") {
      filtered = filtered.filter((recipe) => recipe.category === filters.category)
    }

    // Filter by ingredients
    if (filters.ingredients.length > 0) {
      filtered = filtered.filter((recipe) =>
        filters.ingredients.every((ingredient) =>
          recipe.ingredients.some((recipeIngredient) =>
            recipeIngredient.toLowerCase().includes(ingredient.toLowerCase()),
          ),
        ),
      )
    }

    setFilteredRecipes(filtered)
  }

  // Featured recipes for carousel (just use the first 5 for demo)
  const featuredRecipes = recipes.slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>

      {/* Featured Recipes Carousel */}
      <RecipeCarousel recipes={featuredRecipes} />

      {/* Filters */}
      <div className="my-8">
        <RecipeFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filteredRecipes.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No recipes found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
