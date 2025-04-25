import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"

import type { Blog } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={blog.image_url || "/placeholder.svg?height=300&width=500"}
            alt={blog.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4 flex-1">
          <h3 className="text-lg font-semibold line-clamp-2">{blog.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{blog.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{blog.read_time} min read</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
