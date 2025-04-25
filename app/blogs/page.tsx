"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Blog } from "@/lib/types"

import { BlogCard } from "@/components/blog/blog-card"

// Mock data for initial render
const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "The Art of Mindful Cooking",
    slug: "art-of-mindful-cooking",
    description:
      "Discover how cooking can become a form of meditation and mindfulness practice, helping you to be present and find joy in the process.",
    image_url: "/placeholder.svg?height=300&width=500&text=Mindful+Cooking",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
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
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Music", "Culture", "India"],
    read_time: 8,
    created_at: "2023-02-15T10:45:00Z",
  },
  {
    id: "3",
    title: "The Evolution of Web Development",
    slug: "evolution-web-development",
    description:
      "From static HTML pages to modern frameworks and beyond - tracing the journey of web development over the decades.",
    image_url: "/placeholder.svg?height=300&width=500&text=Web+Development",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Technology", "Web Development", "Programming"],
    read_time: 10,
    created_at: "2023-03-22T09:15:00Z",
  },
  {
    id: "4",
    title: "Sustainable Living in Urban Spaces",
    slug: "sustainable-living-urban",
    description: "Practical tips and ideas for living more sustainably in city apartments and small urban spaces.",
    image_url: "/placeholder.svg?height=300&width=500&text=Sustainable+Living",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Sustainability", "Urban Living", "Environment"],
    read_time: 7,
    created_at: "2023-04-05T16:20:00Z",
  },
  {
    id: "5",
    title: "The Psychology of Music Preferences",
    slug: "psychology-music-preferences",
    description:
      "Exploring how our personalities, experiences, and cultural backgrounds shape our musical tastes and preferences.",
    image_url: "/placeholder.svg?height=300&width=500&text=Music+Psychology",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Music", "Psychology", "Culture"],
    read_time: 6,
    created_at: "2023-05-18T11:30:00Z",
  },
  {
    id: "6",
    title: "Traditional Indian Cooking Techniques",
    slug: "traditional-indian-cooking",
    description: "Exploring the ancient methods and techniques that make Indian cuisine so flavorful and diverse.",
    image_url: "/placeholder.svg?height=300&width=500&text=Indian+Cooking",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    author: "Dhruv Agarwat",
    tags: ["Cooking", "India", "Culture"],
    read_time: 9,
    created_at: "2023-06-10T13:45:00Z",
  },
]

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching blogs:", error)
          return
        }

        if (data) {
          setBlogs(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Comment out the actual fetch for now and use mock data
    // fetchBlogs()
    setIsLoading(false)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>

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
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}
