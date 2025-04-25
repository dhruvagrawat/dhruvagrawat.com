import Image from "next/image"
import Link from "next/link"
import { Clock, Calendar } from "lucide-react"

import type { Article } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const date = new Date(article.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col border-l-4 border-l-primary">
        <div className="aspect-[3/2] relative overflow-hidden">
          <Image
            src={article.image_url || "/placeholder.svg?height=300&width=500"}
            alt={article.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4 flex-1">
          <h3 className="text-lg font-semibold line-clamp-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{article.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{article.read_time} min read</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
