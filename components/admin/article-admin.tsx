"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import type { Article } from "@/lib/types"

// Supabase will handle data fetching via API routes

// Available tags for selection
const availableTags = [
  "Technology",
  "Healthcare",
  "AI",
  "Quantum Computing",
  "Science",
  "Psychology",
  "Behavior",
  "Environment",
  "Climate",
  "Programming",
  "Computer Science",
  "Neuroscience",
  "Music",
  "Education",
  "Finance",
  "Business",
  "Startups",
  "Innovation",
  "Research",
  "Data Science",
]

// Mock articles data
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Introduction to AI",
    slug: "introduction-to-ai",
    description: "Learn the basics of Artificial Intelligence.",
    image_url: "https://example.com/ai.jpg",
    content: "# AI Basics\n...",
    author: "John Doe",
    tags: ["AI", "Technology"],
    read_time: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Quantum Computing Explained",
    slug: "quantum-computing-explained",
    description: "Understand the fundamentals of Quantum Computing.",
    image_url: "https://example.com/quantum.jpg",
    content: "# Quantum Computing\n...",
    author: "Jane Smith",
    tags: ["Quantum Computing", "Science"],
    read_time: 20,
    created_at: new Date().toISOString(),
  },
]

export function ArticleAdmin() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch articles from API on component mount
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/articles")
      if (!res.ok) throw new Error("Failed to fetch articles")
      const data = await res.json()
      setArticles(data)
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Form state
  const [formData, setFormData] = useState<Partial<Article>>({
    title: "",
    description: "",
    image_url: "",
    content: "",
    author: "Dhruv Agarwat",
    tags: [],
    read_time: 10,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      content: "",
      author: "Dhruv Agarwat",
      tags: [],
      read_time: 10,
    })
    setEditingArticle(null)
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
      const slug =
        formData.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") || ""

      const articleData = {
        title: formData.title || "Untitled Article",
        slug,
        description: formData.description || "",
        image_url: formData.image_url || "",
        content: formData.content || "",
        author: formData.author || "",
        tags: formData.tags || [],
        read_time: Number(formData.read_time) || 10,
      }

      if (editingArticle) {
        const res = await fetch(`/api/articles/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleData),
        })
        if (!res.ok) throw new Error("Failed to update article")
      } else {
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleData),
        })
        if (!res.ok) throw new Error("Failed to create article")
      }

      await fetchArticles()
      resetForm()
    } catch (error) {
      console.error("Error saving article:", error)
      alert("Error saving article. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      description: article.description,
      image_url: article.image_url,
      content: article.content,
      author: article.author,
      tags: article.tags,
      read_time: article.read_time,
    })
    setIsAddingNew(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete article")
      await fetchArticles()
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("Error deleting article. Please try again.")
    }
  }

  return (
    <div>
      {isAddingNew ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{editingArticle ? "Edit Article" : "Add New Article"}</h2>
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
                {isSubmitting ? "Saving..." : editingArticle ? "Update Article" : "Add Article"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Articles</h2>
            <Button onClick={() => setIsAddingNew(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Article
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-zinc-400">Loading articles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.length === 0 ? (
                <p className="text-zinc-400 col-span-full">No articles yet. Create one to get started.</p>
              ) : (
                articles.map((article) => (
                  <Card key={article.id} className="admin-card bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2">{article.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(article)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
