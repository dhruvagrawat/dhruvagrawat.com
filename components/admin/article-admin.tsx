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
import type { Article } from "@/lib/types"

// Mock data
const mockArticles: Article[] = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence in Healthcare",
    slug: "future-ai-healthcare",
    description:
      "Exploring how AI technologies are transforming diagnosis, treatment, and patient care in the medical field.",
    image_url: "/placeholder.svg?height=300&width=500&text=AI+in+Healthcare",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: "Dhruv Agarwat",
    tags: ["Technology", "Healthcare", "AI"],
    read_time: 12,
    created_at: "2023-01-20T11:30:00Z",
  },
  {
    id: "2",
    title: "Understanding Quantum Computing: A Beginner's Guide",
    slug: "quantum-computing-guide",
    description:
      "A simplified explanation of quantum computing principles and their potential impact on computational problems.",
    image_url: "/placeholder.svg?height=300&width=500&text=Quantum+Computing",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: "Dhruv Agarwat",
    tags: ["Technology", "Quantum Computing", "Science"],
    read_time: 15,
    created_at: "2023-02-05T14:45:00Z",
  },
]

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

export function ArticleAdmin() {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // Generate a slug from the title
      const slug =
        formData.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") || ""

      const articleData: Article = {
        id: editingArticle?.id || `temp-${Date.now()}`,
        title: formData.title || "Untitled Article",
        slug,
        description: formData.description || "",
        image_url: formData.image_url || "/placeholder.svg?height=300&width=500",
        content: formData.content || "",
        author: formData.author || "Dhruv Agarwat",
        tags: formData.tags || [],
        read_time: Number(formData.read_time) || 10,
        created_at: editingArticle?.created_at || new Date().toISOString(),
      }

      // Simulate API call to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingArticle) {
        // Update existing article
        setArticles((prev) => prev.map((a) => (a.id === editingArticle.id ? articleData : a)))
        console.log("Updated article in Supabase:", articleData)
      } else {
        // Add new article
        setArticles((prev) => [...prev, articleData])
        console.log("Added new article to Supabase:", articleData)
      }

      resetForm()
    } catch (error) {
      console.error("Error saving article:", error)
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
      // Simulate API call to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setArticles((prev) => prev.filter((article) => article.id !== id))
      console.log("Deleted article from Supabase:", id)
    } catch (error) {
      console.error("Error deleting article:", error)
    }
  }

  return (
    <div>
      {!isAddingNew ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Articles</h2>
            <Button onClick={() => setIsAddingNew(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Article
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
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
            ))}
          </div>
        </>
      ) : (
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
      )}
    </div>
  )
}
