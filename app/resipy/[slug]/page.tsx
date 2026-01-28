"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Clock, Users } from "lucide-react"

import type { Recipe } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { RecipeCard } from "@/components/recipe/recipe-card"

// Mock data for initial render
const mockRecipe: Recipe = {
  id: "1",
  title: "Paneer Butter Masala",
  slug: "paneer-butter-masala",
  description: "A rich and creamy North Indian curry made with paneer cheese in a tomato-based sauce.",
  image_url: "/placeholder.svg?height=500&width=1000&text=Paneer+Butter+Masala",
  tags: ["Indian", "Vegetarian", "Curry"],
  category: "Indian",
  cook_time: 45,
  servings: 4,
  ingredients: [
    "500g paneer, cubed",
    "2 onions, finely chopped",
    "3 tomatoes, pureed",
    "2 tbsp butter",
    "1 tbsp ginger-garlic paste",
    "1 tsp red chili powder",
    "1 tsp garam masala",
    "1/2 cup cream",
    "Salt to taste",
  ],
  directions: [
    "Heat butter in a pan and add the chopped onions. Sauté until golden brown.",
    "Add ginger-garlic paste and sauté for another minute.",
    "Add tomato puree, red chili powder, and salt. Cook until the oil separates.",
    "Add paneer cubes and gently mix.",
    "Pour in cream and simmer for 5 minutes.",
    "Sprinkle garam masala and serve hot with naan or rice.",
  ],
  created_at: "2023-01-15T12:00:00Z",
}

const mockRecommendedRecipes: Recipe[] = [
  {
    id: "2",
    title: "Chicken Tikka Masala",
    slug: "chicken-tikka-masala",
    description: "Grilled chunks of chicken in a creamy tomato-based curry sauce.",
    image_url: "/placeholder.svg?height=300&width=500&text=Chicken+Tikka+Masala",
    tags: ["Indian", "Chicken", "Curry"],
    category: "Indian",
    cook_time: 60,
    servings: 4,
    ingredients: [],
    directions: [],
    created_at: "2023-03-10T18:45:00Z",
  },
  {
    id: "3",
    title: "Vegetable Biryani",
    slug: "vegetable-biryani",
    description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices.",
    image_url: "/placeholder.svg?height=300&width=500&text=Vegetable+Biryani",
    tags: ["Indian", "Vegetarian", "Rice"],
    category: "Indian",
    cook_time: 50,
    servings: 6,
    ingredients: [],
    directions: [],
    created_at: "2023-02-05T14:30:00Z",
  },
  {
    id: "4",
    title: "Butter Chicken",
    slug: "butter-chicken",
    description: "Tender chicken in a rich, buttery tomato sauce.",
    image_url: "/placeholder.svg?height=300&width=500&text=Butter+Chicken",
    tags: ["Indian", "Chicken", "Curry"],
    category: "Indian",
    cook_time: 55,
    servings: 4,
    ingredients: [],
    directions: [],
    created_at: "2023-04-20T16:15:00Z",
  },
]

export default function RecipeDetailPage({ params }: { params: { slug: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("recipes").select("*").eq("slug", params.slug).single()

        if (error) {
          console.error("Error fetching recipe:", error)
          return
        }

        if (data) {
          setRecipe(data)

          // Fetch recommended recipes
          const { data: recommendedData, error: recommendedError } = await supabase
            .from("recipes")
            .select("*")
            .neq("id", data.id)
            .eq("category", data.category)
            .limit(3)

          if (!recommendedError && recommendedData) {
            setRecommendedRecipes(recommendedData)
          }
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Comment out the actual fetch for now and use mock data
    // fetchRecipe()
    setRecipe(mockRecipe)
    setRecommendedRecipes(mockRecommendedRecipes)
    setIsLoading(false)
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Recipe not found</h1>
        <p>The recipe you're looking for doesn't exist or has been removed.</p>
        <Link href="/resipy" className="text-primary hover:underline mt-4 inline-block">
          Back to all recipes
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/resipy" className="hover:text-foreground">
          Resipy
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{recipe.title}</span>
      </nav>

      {/* Recipe Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-lg text-muted-foreground mb-6">{recipe.description}</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{recipe.cook_time} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </div>

      {/* Recipe Image */}
      <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
        <Image
          src={recipe.image_url || "/placeholder.svg?height=500&width=1000"}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block h-2 w-2 rounded-full bg-primary mt-2 mr-3"></span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Directions */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Directions</h2>
          <ol className="space-y-6">
            {recipe.directions.map((step, index) => (
              <li key={index} className="flex">
                <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-medium mr-4">
                  {index + 1}
                </span>
                <p className="pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Recommended Recipes */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  )
}
