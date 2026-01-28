"use client"

import { useState, useEffect } from "react"
import type { Article } from "@/lib/types"

import { ArticleCard } from "@/components/article/article-card"

// All data fetched from Supabase

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        console.log("[v0] Fetching articles from API...")
        const res = await fetch("/api/articles")
        if (res.ok) {
          const data = await res.json()
          console.log("[v0] Articles fetched:", data)
          setArticles(data)
        } else {
          console.error("[v0] API error:", res.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching articles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
