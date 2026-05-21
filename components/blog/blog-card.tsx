import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import type { BlogMeta } from "@/content/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  blog: BlogMeta
}

export function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
        {blog.coverImage && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
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
          <span>{formattedDate}</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{blog.readTime} min read</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
