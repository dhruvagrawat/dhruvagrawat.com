import { allBlogs } from "@/content/blogs"
import { BlogCard } from "@/components/blog/blog-card"

export const metadata = {
  title: "Blogs | Dhruv Agrawat",
  description: "Thoughts on software, startups, and building things.",
}

export default function BlogsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Blogs</h1>
      <p className="text-muted-foreground mb-8">Thoughts on software, startups, and building things.</p>

      {allBlogs.length === 0 ? (
        <p className="text-muted-foreground">No posts yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBlogs
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
        </div>
      )}
    </div>
  )
}
