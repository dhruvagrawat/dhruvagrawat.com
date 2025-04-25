"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Article } from "@/lib/types"

import { ArticleCard } from "@/components/article/article-card"

// Mock data for initial render
const mockArticles: Article[] = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence in Healthcare",
    slug: "future-ai-healthcare",
    description:
      "Exploring how AI technologies are transforming diagnosis, treatment, and patient care in the medical field.",
    image_url: "/placeholder.svg?height=300&width=500&text=AI+in+Healthcare",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
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
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Technology", "Quantum Computing", "Science"],
    read_time: 15,
    created_at: "2023-02-05T14:45:00Z",
  },
  {
    id: "3",
    title: "The Psychology of Decision Making",
    slug: "psychology-decision-making",
    description:
      "Examining the cognitive biases and mental shortcuts that influence our everyday choices and decisions.",
    image_url: "/placeholder.svg?height=300&width=500&text=Decision+Making",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Psychology", "Behavior", "Science"],
    read_time: 10,
    created_at: "2023-03-15T09:20:00Z",
  },
  {
    id: "4",
    title: "Climate Change: Understanding the Science and Solutions",
    slug: "climate-change-science",
    description:
      "A comprehensive look at the scientific consensus on climate change and potential pathways to mitigate its effects.",
    image_url: "/placeholder.svg?height=300&width=500&text=Climate+Change",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Environment", "Science", "Climate"],
    read_time: 18,
    created_at: "2023-04-10T16:15:00Z",
  },
  {
    id: "5",
    title: "The Evolution of Programming Languages",
    slug: "evolution-programming-languages",
    description:
      "Tracing the history and development of programming languages from early assembly to modern high-level languages.",
    image_url: "/placeholder.svg?height=300&width=500&text=Programming+Languages",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Technology", "Programming", "Computer Science"],
    read_time: 14,
    created_at: "2023-05-22T13:40:00Z",
  },
  {
    id: "6",
    title: "The Neuroscience of Music: How Music Affects the Brain",
    slug: "neuroscience-music-brain",
    description:
      "Exploring the complex relationship between music, emotions, and cognitive processes in the human brain.",
    image_url: "/placeholder.svg?height=300&width=500&text=Music+and+Brain",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Neuroscience", "Music", "Psychology"],
    read_time: 16,
    created_at: "2023-06-18T10:25:00Z",
  },
]

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching articles:", error)
          return
        }

        if (data) {
          setArticles(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Comment out the actual fetch for now and use mock data
    // fetchArticles()
    setIsLoading(false)
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
