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
import type { Blog } from "@/lib/types"

// Mock data
const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "The Art of Mindful Cooking",
    slug: "art-of-mindful-cooking",
    description:
      "Discover how cooking can become a form of meditation and mindfulness practice, helping you to be present and find joy in the process.",
    image_url: "/placeholder.svg?height=300&width=500&text=Mindful+Cooking",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: "Dhruv Agarwat",
    tags: ["Cooking", "Mindfulness", "Wellness"],
    read_time: 5,
    created_at: "2023-01-10T14:30:00Z",
  },
  {
    id: "2",
    title: "Exploring the Music of North India",
    slug: "exploring-music-north-india",
    description:
      "A journey through the classical traditions of Hindustani music, exploring ragas, instruments, and the cultural significance.",
    image_url: "/placeholder.svg?height=300&width=500&text=North+Indian+Music",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: "Dhruv Agarwat",
    tags: ["Music", "Culture", "India"],
    read_time: 8,
    created_at: "2023-02-15T10:45:00Z",
  },
]

// Available tags for selection
const availableTags = [
  "Cooking",
  "Mindfulness",
  "Wellness",
  "Music",
  "Culture",
  "India",
  "Technology",
  "Web Development",
  "Programming",
  "Sustainability",
  "Urban Living",
  "Environment",
  "Psychology",
  "Travel",
  "Food",
  "Art",
  "Design",
  "Photography",
  "Books",
  "Film",
]

export function BlogAdmin() {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: "",
    description: "",
    image_url: "",
    content: "",
    author: "Dhruv Agarwat",
    tags: [],
    read_time: 5,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      content: "",
      author: "Dhruv Agarwat",
      tags: [],
      read_time: 5,
    })
    setEditingBlog(null)
    setIsAddingNew(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

      const blogData: Blog = {
        id: editingBlog?.id || `temp-${Date.now()}`,
        title: formData.title || "Untitled Blog",
        slug,
        description: formData.description || "",
        image_url: formData.image_url || "/placeholder.svg?height=300&width=500",
        content: formData.content || "",
        author: formData.author || "Dhruv Agarwat",
        tags: formData.tags || [],
        read_time: Number(formData.read_time) || 5,
        created_at: editingBlog?.created_at || new Date().toISOString(),
      }

      // Simulate API call to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingBlog) {
        // Update existing blog
        setBlogs((prev) => prev.map((b) => (b.id === editingBlog.id ? blogData : b)))
        console.log("Updated blog in Supabase:", blogData)
      } else {
        // Add new blog
        setBlogs((prev) => [...prev, blogData])
        console.log("Added new blog to Supabase:", blogData)
      }

      resetForm()
    } catch (error) {
      console.error("Error saving blog:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      description: blog.description,
      image_url: blog.image_url,
      content: blog.content,
      author: blog.author,
      tags: blog.tags,
      read_time: blog.read_time,
    })
    setIsAddingNew(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      // Simulate API call to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setBlogs((prev) => prev.filter((blog) => blog.id !== id))
      console.log("Deleted blog from Supabase:", id)
    } catch (error) {
      console.error("Error deleting blog:", error)
    }
  }

  return (
    <div>
      {!isAddingNew ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Blogs</h2>
            <Button onClick={() => setIsAddingNew(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Blog
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="admin-card bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{blog.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">{blog.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/blogs/${blog.slug}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(blog)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(blog.id)}>
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
            <h2 className="text-2xl font-bold">{editingBlog ? "Edit Blog" : "Add New Blog"}</h2>
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
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="read_time">Read Time (minutes)</Label>
                    <Input
                      id="read_time"
                      name="read_time"
                      type="number"
                      value={formData.read_time}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border-zinc-700"
                      min="1"
                    />
                  </div>
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

              <div>
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 min-h-[400px] font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingBlog ? "Update Blog" : "Add Blog"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
