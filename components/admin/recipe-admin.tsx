"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Recipe } from "@/lib/types"

// Mock data
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
]

// Available categories and tags for selection
const availableCategories = ["Indian", "Italian", "Chinese", "Mexican", "Thai", "American", "French", "Japanese"]
const availableTags = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Quick",
  "Easy",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
  "Soup",
  "Salad",
  "Curry",
  "Pasta",
  "Rice",
  "Seafood",
  "Chicken",
  "Beef",
  "Pork",
  "Lamb",
]

export function RecipeAdmin() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<Recipe>>({
    title: "",
    description: "",
    image_url: "",
    category: "",
    tags: [],
    cook_time: 0,
    servings: 0,
    ingredients: [""],
    directions: [""],
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "",
      tags: [],
      cook_time: 0,
      servings: 0,
      ingredients: [""],
      directions: [""],
    })
    setEditingRecipe(null)
    setIsAddingNew(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => {
      const currentTags = prev.tags || []
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter((t) => t !== tag) }
      } else {
        return { ...prev, tags: [...currentTags, tag] }
      }
    })
  }

  const handleIngredientChange = (index: number, value: string) => {
    setFormData((prev) => {
      const ingredients = [...(prev.ingredients || [])]
      ingredients[index] = value
      return { ...prev, ingredients }
    })
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ""],
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => {
      const ingredients = [...(prev.ingredients || [])]
      ingredients.splice(index, 1)
      return { ...prev, ingredients }
    })
  }

  const handleDirectionChange = (index: number, value: string) => {
    setFormData((prev) => {
      const directions = [...(prev.directions || [])]
      directions[index] = value
      return { ...prev, directions }
    })
  }

  const addDirection = () => {
    setFormData((prev) => ({
      ...prev,
      directions: [...(prev.directions || []), ""],
    }))
  }

  const removeDirection = (index: number) => {
    setFormData((prev) => {
      const directions = [...(prev.directions || [])]
      directions.splice(index, 1)
      return { ...prev, directions }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Generate a slug from the title
      const slug =
        formData.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") || ""

      const recipeData: Recipe = {
        id: editingRecipe?.id || `temp-${Date.now()}`,
        title: formData.title || "Untitled Recipe",
        slug,
        description: formData.description || "",
        image_url: formData.image_url || "/placeholder.svg?height=300&width=500",
        category: formData.category || "Uncategorized",
        tags: formData.tags || [],
        cook_time: Number(formData.cook_time) || 0,
        servings: Number(formData.servings) || 0,
        ingredients: (formData.ingredients || []).filter((i) => i.trim() !== ""),
        directions: (formData.directions || []).filter((d) => d.trim() !== ""),
        created_at: editingRecipe?.created_at || new Date().toISOString(),
      }

      // Simulate API call to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingRecipe) {
        // Update existing recipe
        setRecipes((prev) => prev.map((r) => (r.id === editingRecipe.id ? recipeData : r)))
        console.log("Updated recipe in Supabase:", recipeData)
      } else {
        // Add new recipe
        setRecipes((prev) => [...prev, recipeData])
        console.log("Added new recipe to Supabase:", recipeData)
      }

      resetForm()
    } catch (error) {
      console.error("Error saving recipe:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setFormData({
      title: recipe.title,
      description: recipe.description,
      image_url: recipe.image_url,
      category: recipe.category,
      tags: recipe.tags,
      cook_time: recipe.cook_time,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      directions: recipe.directions,
    })
    setIsAddingNew(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return

    try {
      // Simulate API call to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
      console.log("Deleted recipe from Supabase:", id)
    } catch (error) {
      console.error("Error deleting recipe:", error)
    }
  }

  return (
    <div>
      {!isAddingNew ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recipes</h2>
            <Button onClick={() => setIsAddingNew(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Recipe
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="admin-card bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipe.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">{recipe.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/resipy/${recipe.slug}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(recipe)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(recipe.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{editingRecipe ? "Edit Recipe" : "Add New Recipe"}</h2>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cook_time">Cook Time (minutes)</Label>
                    <Input
                      id="cook_time"
                      name="cook_time"
                      type="number"
                      value={formData.cook_time}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border-zinc-700"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      name="servings"
                      type="number"
                      value={formData.servings}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border-zinc-700"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={formData.tags?.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Ingredients</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addIngredient}>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {formData.ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        disabled={formData.ingredients?.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Directions</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addDirection}>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {formData.directions?.map((direction, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Textarea
                        value={direction}
                        onChange={(e) => handleDirectionChange(index, e.target.value)}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder={`Step ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDirection(index)}
                        disabled={formData.directions?.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingRecipe ? "Update Recipe" : "Add Recipe"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
