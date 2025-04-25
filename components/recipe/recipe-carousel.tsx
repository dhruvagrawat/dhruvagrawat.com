"use client"

import Image from "next/image"
import Link from "next/link"

import type { Recipe } from "@/lib/types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"

interface RecipeCarouselProps {
  recipes: Recipe[]
}

export function RecipeCarousel({ recipes }: RecipeCarouselProps) {
  return (
    <div className="py-6">
      <Carousel className="w-full">
        <CarouselContent>
          {recipes.map((recipe) => (
            <CarouselItem key={recipe.id} className="md:basis-1/2 lg:basis-1/3">
              <Link href={`/resipy/${recipe.slug}`}>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={recipe.image_url || "/placeholder.svg?height=300&width=500"}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{recipe.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 lg:-left-12" />
        <CarouselNext className="right-2 lg:-right-12" />
      </Carousel>
    </div>
  )
}
