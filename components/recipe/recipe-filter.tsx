"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Mock data for filters
const categories = ["All", "Indian", "Italian", "Chinese", "Mexican", "Thai", "American"]

const ingredients = [
  "Chicken",
  "Beef",
  "Pork",
  "Fish",
  "Tofu",
  "Rice",
  "Pasta",
  "Potatoes",
  "Tomatoes",
  "Onions",
  "Garlic",
  "Bell Peppers",
]

interface RecipeFilterProps {
  onFilterChange: (filters: {
    search: string
    category: string
    ingredients: string[]
  }) => void
}

export function RecipeFilter({ onFilterChange }: RecipeFilterProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({
      search: e.target.value,
      category,
      ingredients: selectedIngredients,
    })
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    onFilterChange({
      search,
      category: value,
      ingredients: selectedIngredients,
    })
  }

  const handleIngredientToggle = (ingredient: string) => {
    const updatedIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter((item) => item !== ingredient)
      : [...selectedIngredients, ingredient]

    setSelectedIngredients(updatedIngredients)
    onFilterChange({
      search,
      category,
      ingredients: updatedIngredients,
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search recipes..." value={search} onChange={handleSearchChange} className="pl-9" />
      </div>

      <Select value={category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full md:w-[200px] justify-between">
            Ingredients
            <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
              {selectedIngredients.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Select Ingredients</h4>
            <div className="grid gap-2 max-h-[300px] overflow-auto">
              {ingredients.map((ingredient) => (
                <div key={ingredient} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ingredient-${ingredient}`}
                    checked={selectedIngredients.includes(ingredient)}
                    onCheckedChange={() => handleIngredientToggle(ingredient)}
                  />
                  <Label htmlFor={`ingredient-${ingredient}`}>{ingredient}</Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
