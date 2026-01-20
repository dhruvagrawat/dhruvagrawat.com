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

// Supabase will handle data fetching via API routes

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

const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Mock Recipe 1",
    slug: "mock-recipe-1",
    description: "This is a mock recipe for demonstration purposes.",
    image_url: "/placeholder.svg?height=300&width=500",
    category: "Italian",
    tags: ["Dinner", "Pasta"],
    cook_time: 30,
    servings: 4,
    ingredients: ["Pasta", "Tomato Sauce", "Cheese"],
    directions: ["Cook pasta", "Add tomato sauce", "Top with cheese"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Mock Recipe 2",
    slug: "mock-recipe-2",
    description: "Another mock recipe for testing.",
    image_url: "/placeholder.svg?height=300&width=500",
    category: "Chinese",
    tags: ["Lunch", "Rice"],
    cook_time: 20,
    servings: 2,
    ingredients: ["Rice", "Chicken", "Vegetables"],
    directions: ["Cook rice", "Add chicken and vegetables"],
    created_at: new Date().toISOString(),
  },
]

export function RecipeAdmin() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

  // Fetch recipes from API on component mount
  useState(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/recipes")
      if (!res.ok) throw new Error("Failed to fetch recipes")
      const data = await res.json()
      setRecipes(data)
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
      const slug =
        formData.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") || ""

      const recipeData = {
        title: formData.title || "Untitled Recipe",
        slug,
        description: formData.description || "",
        image_url: formData.image_url || "",
        category: formData.category || "Uncategorized",
        tags: formData.tags || [],
        cook_time: Number(formData.cook_time) || 0,
        servings: Number(formData.servings) || 0,
        ingredients: (formData.ingredients || []).filter((i) => i.trim() !== ""),
        directions: (formData.directions || []).filter((d) => d.trim() !== ""),
      }

      if (editingRecipe) {
        const res = await fetch(`/api/recipes/${editingRecipe.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipeData),
        })
        if (!res.ok) throw new Error("Failed to update recipe")
      } else {
        const res = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipeData),
        })
        if (!res.ok) throw new Error("Failed to create recipe")
      }

      await fetchRecipes()
      resetForm()
    } catch (error) {
      console.error("Error saving recipe:", error)
      alert("Error saving recipe. Please try again.")
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
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete recipe")
      await fetchRecipes()
    } catch (error) {
      console.error("Error deleting recipe:", error)
      alert("Error deleting recipe. Please try again.")
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

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-zinc-400">Loading recipes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.length === 0 ? (
                <p className="text-zinc-400 col-span-full">No recipes yet. Create one to get started.</p>
              ) : recipes.map((recipe) => (
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
          )}
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
