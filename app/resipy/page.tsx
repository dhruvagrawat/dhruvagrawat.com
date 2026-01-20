"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Recipe } from "@/lib/types"

import { RecipeCarousel } from "@/components/recipe/recipe-carousel"
import { RecipeFilter } from "@/components/recipe/recipe-filter"
import { RecipeCard } from "@/components/recipe/recipe-card"

// Mock data for initial render
const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Paneer Butter Masala",
    slug: "paneer-butter-masala",
    description: "A rich and creamy North Indian curry made with paneer cheese in a tomato-based sauce.",
    image_url: "/placeholder.svg?height=300&width=500&text=Paneer+Butter+Masala",
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
  },
  {
    id: "2",
    title: "Spaghetti Carbonara",
    slug: "spaghetti-carbonara",
    description: "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
    image_url: "/placeholder.svg?height=300&width=500&text=Spaghetti+Carbonara",
    tags: ["Italian", "Pasta", "Quick"],
    category: "Italian",
    cook_time: 30,
    servings: 2,
    ingredients: [
      "200g spaghetti",
      "100g pancetta or guanciale, diced",
      "2 large eggs",
      "50g Pecorino Romano, grated",
      "50g Parmigiano Reggiano, grated",
      "Freshly ground black pepper",
      "Salt for pasta water",
    ],
    directions: [
      "Bring a large pot of salted water to boil and cook spaghetti according to package instructions.",
      "While pasta cooks, sauté pancetta in a large pan until crispy.",
      "In a bowl, whisk eggs and mix in the grated cheeses and black pepper.",
      "Drain pasta, reserving some pasta water, and immediately add to the pan with pancetta.",
      "Remove pan from heat and quickly stir in the egg and cheese mixture, creating a creamy sauce.",
      "If needed, add a splash of reserved pasta water to loosen the sauce.",
      "Serve immediately with extra grated cheese and black pepper.",
    ],
    created_at: "2023-02-20T14:30:00Z",
  },
  {
    id: "3",
    title: "Chicken Tikka Masala",
    slug: "chicken-tikka-masala",
    description: "Grilled chunks of chicken in a creamy tomato-based curry sauce.",
    image_url: "/placeholder.svg?height=300&width=500&text=Chicken+Tikka+Masala",
    tags: ["Indian", "Chicken", "Curry"],
    category: "Indian",
    cook_time: 60,
    servings: 4,
    ingredients: [
      "500g chicken breast, cubed",
      "1 cup yogurt",
      "2 tbsp lemon juice",
      "2 tsp ground cumin",
      "2 tsp ground coriander",
      "2 tsp paprika",
      "1 tsp turmeric",
      "1 large onion, diced",
      "3 cloves garlic, minced",
      "1 tbsp ginger, grated",
      "400g canned tomatoes",
      "1 cup heavy cream",
      "Fresh cilantro for garnish",
    ],
    directions: [
      "Marinate chicken in yogurt, lemon juice, and half the spices for at least 1 hour.",
      "Grill or broil the marinated chicken until charred and cooked through.",
      "In a large pan, sauté onions until soft, then add garlic and ginger.",
      "Add remaining spices and cook for 1 minute until fragrant.",
      "Add tomatoes and simmer for 15 minutes until sauce thickens.",
      "Stir in cream and add the grilled chicken. Simmer for 5-10 minutes.",
      "Garnish with fresh cilantro and serve with rice or naan.",
    ],
    created_at: "2023-03-10T18:45:00Z",
  },
  {
    id: "4",
    title: "Vegetable Stir Fry",
    slug: "vegetable-stir-fry",
    description: "A quick and healthy stir fry with colorful vegetables and a savory sauce.",
    image_url: "/placeholder.svg?height=300&width=500&text=Vegetable+Stir+Fry",
    tags: ["Chinese", "Vegetarian", "Quick"],
    category: "Chinese",
    cook_time: 20,
    servings: 2,
    ingredients: [
      "1 bell pepper, sliced",
      "1 carrot, julienned",
      "1 cup broccoli florets",
      "1 cup snap peas",
      "2 cloves garlic, minced",
      "1 tbsp ginger, grated",
      "2 tbsp soy sauce",
      "1 tbsp oyster sauce",
      "1 tsp sesame oil",
      "2 tbsp vegetable oil",
      "1 tsp cornstarch mixed with 2 tbsp water",
    ],
    directions: [
      "Heat vegetable oil in a wok or large frying pan over high heat.",
      "Add garlic and ginger, stir for 30 seconds until fragrant.",
      "Add vegetables and stir fry for 3-4 minutes until crisp-tender.",
      "Mix soy sauce, oyster sauce, and sesame oil in a small bowl.",
      "Pour sauce over vegetables and toss to coat.",
      "Add cornstarch slurry and cook until sauce thickens, about 1 minute.",
      "Serve hot over rice or noodles.",
    ],
    created_at: "2023-04-05T20:15:00Z",
  },
  {
    id: "5",
    title: "Chocolate Chip Cookies",
    slug: "chocolate-chip-cookies",
    description: "Classic homemade chocolate chip cookies that are soft, chewy, and delicious.",
    image_url: "/placeholder.svg?height=300&width=500&text=Chocolate+Chip+Cookies",
    tags: ["Dessert", "Baking", "American"],
    category: "American",
    cook_time: 25,
    servings: 24,
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup unsalted butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups semi-sweet chocolate chips",
    ],
    directions: [
      "Preheat oven to 375°F (190°C).",
      "In a small bowl, mix flour, baking soda, and salt.",
      "In a large bowl, cream together butter and both sugars until light and fluffy.",
      "Beat in eggs one at a time, then stir in vanilla.",
      "Gradually blend in the dry ingredients.",
      "Fold in chocolate chips.",
      "Drop by rounded tablespoons onto ungreased baking sheets.",
      "Bake for 9 to 11 minutes or until golden brown.",
      "Let stand on baking sheet for 2 minutes, then remove to cool on wire racks.",
    ],
    created_at: "2023-05-12T15:20:00Z",
  },
  {
    id: "6",
    title: "Mushroom Risotto",
    slug: "mushroom-risotto",
    description: "Creamy Italian rice dish with mushrooms, white wine, and Parmesan cheese.",
    image_url: "/placeholder.svg?height=300&width=500&text=Mushroom+Risotto",
    tags: ["Italian", "Vegetarian", "Rice"],
    category: "Italian",
    cook_time: 40,
    servings: 4,
    ingredients: [
      "1 1/2 cups Arborio rice",
      "4 cups vegetable broth, heated",
      "1/2 cup dry white wine",
      "300g mixed mushrooms, sliced",
      "1 onion, finely chopped",
      "2 cloves garlic, minced",
      "2 tbsp olive oil",
      "2 tbsp butter",
      "1/2 cup grated Parmesan cheese",
      "2 tbsp fresh parsley, chopped",
      "Salt and pepper to taste",
    ],
    directions: [
      "In a large pan, heat olive oil and 1 tbsp butter. Sauté mushrooms until golden, then set aside.",
      "In the same pan, sauté onion until translucent. Add garlic and cook for 1 minute.",
      "Add rice and stir for 2 minutes until translucent around the edges.",
      "Pour in wine and stir until absorbed.",
      "Add hot broth one ladle at a time, stirring constantly and waiting until each addition is absorbed before adding more.",
      "After about 18-20 minutes, when rice is creamy but still al dente, stir in mushrooms.",
      "Remove from heat and stir in remaining butter and Parmesan cheese.",
      "Season with salt and pepper, garnish with parsley, and serve immediately.",
    ],
    created_at: "2023-06-18T19:10:00Z",
  },
]

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes)
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(mockRecipes)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        // Try to fetch from Supabase API
        const res = await fetch("/api/recipes")
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setRecipes(data)
            setFilteredRecipes(data)
          }
        }
      } catch (error) {
        console.error("Error fetching recipes:", error)
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
