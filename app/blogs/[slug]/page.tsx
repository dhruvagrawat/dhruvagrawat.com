"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Clock, Calendar } from "lucide-react"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Blog } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

// Mock data for initial render
const mockBlog: Blog = {
  id: "1",
  title: "The Art of Mindful Cooking",
  slug: "art-of-mindful-cooking",
  description:
    "Discover how cooking can become a form of meditation and mindfulness practice, helping you to be present and find joy in the process.",
  image_url: "/placeholder.svg?height=500&width=1000&text=Mindful+Cooking",
  content: `
    <p>In our fast-paced world, cooking is often seen as just another chore to check off our to-do list. But what if we approached cooking as a mindfulness practice? What if we used the time in the kitchen as an opportunity to slow down, be present, and find joy in the process?</p>
    
    <h2>The Mindful Kitchen</h2>
    
    <p>Mindful cooking begins before you even turn on the stove. It starts with the intentional selection of ingredients, appreciating their colors, textures, and origins. When you choose a ripe tomato or a fragrant bunch of basil, take a moment to really observe it. Where did it come from? How did it grow? This connection to your food creates a deeper appreciation for what you're about to prepare.</p>
    
    <p>As you begin to cook, engage all your senses. Listen to the sizzle of onions in the pan, smell the aroma of spices blooming in oil, feel the resistance of a knife slicing through vegetables. These sensory experiences anchor you in the present moment, pulling your attention away from the worries of the day.</p>
    
    <h2>The Joy of Process Over Outcome</h2>
    
    <p>In mindful cooking, the process becomes as important as the outcome. Rather than rushing to get dinner on the table, you savor each step. Chopping vegetables becomes a rhythmic meditation. Stirring a pot becomes an opportunity to observe transformation. Even washing dishes can become a contemplative practice when done with full awareness.</p>
    
    <p>This shift in perspective—from cooking as a means to an end to cooking as an experience to be savored—can transform your relationship with food and with yourself. It creates space for creativity, experimentation, and play in the kitchen.</p>
    
    <h2>Practical Tips for Mindful Cooking</h2>
    
    <ul>
      <li>Begin with a clear, uncluttered workspace to create a sense of calm and order.</li>
      <li>Set an intention before you start cooking. It might be as simple as "I will stay present" or "I will cook with love."</li>
      <li>Put away your phone and turn off distractions. If you enjoy music while cooking, choose something calming and instrumental.</li>
      <li>Take three deep breaths before you begin to center yourself.</li>
      <li>Slow down. Give yourself more time than you think you need.</li>
      <li>When your mind wanders (and it will), gently bring your attention back to the task at hand.</li>
      <li>Express gratitude for the ingredients, the tools, and your own abilities.</li>
    </ul>
    
    <h2>Beyond the Kitchen</h2>
    
    <p>The mindfulness you cultivate in cooking extends beyond the kitchen. It can influence how you eat, encouraging slower, more appreciative consumption. It can affect how you approach other tasks, bringing the same quality of attention to work, relationships, and self-care.</p>
    
    <p>In a world that often values speed and productivity above all else, mindful cooking offers a radical alternative—a way to slow down, connect with yourself and your food, and find joy in the simple act of nourishment.</p>
    
    <p>So the next time you step into the kitchen, try approaching cooking not as a chore to be completed but as a practice to be experienced. You might be surprised by the peace and pleasure you find in the process.</p>
  `,
  author: "Dhruv Agarwat",
  tags: ["Cooking", "Mindfulness", "Wellness"],
  read_time: 5,
  created_at: "2023-01-10T14:30:00Z",
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("blogs").select("*").eq("slug", params.slug).single()

        if (error) {
          console.error("Error fetching blog:", error)
          return
        }

        if (data) {
          setBlog(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Comment out the actual fetch for now and use mock data
    // fetchBlog()
    setBlog(mockBlog)
    setIsLoading(false)
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Blog not found</h1>
        <p>The blog post you're looking for doesn't exist or has been removed.</p>
        <Link href="/blogs" className="text-primary hover:underline mt-4 inline-block">
          Back to all blogs
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/blogs" className="hover:text-foreground">
          Blogs
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{blog.title}</span>
      </nav>

      {/* Blog Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{blog.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
          <div className="flex items-center gap-2">
            <span className="font-medium">By {blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{blog.read_time} min read</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Blog Image */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
          <Image
            src={blog.image_url || "/placeholder.svg?height=500&width=1000"}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </div>
  )
}
