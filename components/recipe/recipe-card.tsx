import Image from "next/image"
import Link from "next/link"
import { Clock, Users } from "lucide-react"

import type { Recipe } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/resipy/${recipe.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={recipe.image_url || "/placeholder.svg?height=300&width=500"}
            alt={recipe.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{recipe.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cook_time} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
