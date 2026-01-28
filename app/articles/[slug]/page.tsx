"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Clock, Calendar } from "lucide-react"

import type { Article } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

// Mock data for initial render
const mockArticle: Article = {
  id: "1",
  title: "The Future of Artificial Intelligence in Healthcare",
  slug: "future-ai-healthcare",
  description:
    "Exploring how AI technologies are transforming diagnosis, treatment, and patient care in the medical field.",
  image_url: "/placeholder.svg?height=500&width=1000&text=AI+in+Healthcare",
  content: `
    <p>Artificial Intelligence (AI) is revolutionizing healthcare in ways that were once the realm of science fiction. From diagnostic tools that can detect diseases earlier than human physicians to personalized treatment plans based on individual genetic profiles, AI is transforming every aspect of medical care.</p>
    
    <h2>Diagnosis: The First Frontier</h2>
    
    <p>One of the most promising applications of AI in healthcare is in diagnosis. Machine learning algorithms can analyze medical images—such as X-rays, MRIs, and CT scans—with remarkable accuracy, often detecting subtle abnormalities that might be missed by the human eye.</p>
    
    <p>For example, AI systems have demonstrated the ability to identify early signs of diseases like cancer, diabetic retinopathy, and Alzheimer's. In some studies, these systems have even outperformed experienced radiologists in diagnostic accuracy.</p>
    
    <p>Beyond image analysis, AI is also being used to interpret complex medical data. Systems can analyze patterns in electronic health records, lab results, and even natural language descriptions of symptoms to assist in diagnosis.</p>
    
    <h2>Treatment: Personalized and Precise</h2>
    
    <p>Once a diagnosis is made, AI can help determine the most effective treatment plan. By analyzing vast datasets of patient outcomes, genetic information, and treatment responses, AI systems can predict which interventions are likely to be most successful for a specific patient.</p>
    
    <p>This approach, known as precision medicine, moves away from the one-size-fits-all model of healthcare toward treatments tailored to individual characteristics. For example, in oncology, AI can analyze a tumor's genetic profile to recommend targeted therapies that are most likely to be effective against that specific cancer.</p>
    
    <p>AI is also transforming drug discovery and development. Machine learning algorithms can predict how different compounds will interact with biological targets, potentially identifying new treatments for diseases or repurposing existing drugs for new applications.</p>
    
    <h2>Patient Care: Beyond the Hospital</h2>
    
    <p>AI's impact extends beyond diagnosis and treatment to ongoing patient care. Virtual nursing assistants can monitor patients, answer questions, and provide support between doctor visits. Wearable devices equipped with AI can track vital signs and alert healthcare providers to potential problems before they become serious.</p>
    
    <p>In mental health, AI chatbots are being developed to provide cognitive behavioral therapy and support for conditions like depression and anxiety, potentially increasing access to mental health services for underserved populations.</p>
    
    <h2>Challenges and Ethical Considerations</h2>
    
    <p>Despite its promise, the integration of AI into healthcare faces significant challenges. Data privacy concerns, the risk of algorithmic bias, and questions about liability when AI systems make mistakes all need to be addressed.</p>
    
    <p>There's also the challenge of integration. Healthcare systems are complex and often resistant to change. Implementing AI solutions requires not just technological innovation but also changes in workflow, training, and organizational culture.</p>
    
    <p>Perhaps most importantly, there are ethical questions about the role of AI in healthcare. While AI can process vast amounts of data and identify patterns, it lacks the empathy, intuition, and ethical reasoning that are central to human medical practice. The challenge is to use AI as a tool that enhances human capabilities rather than as a replacement for human judgment and care.</p>
    
    <h2>The Future: A Collaborative Model</h2>
    
    <p>The most promising vision for the future of AI in healthcare is a collaborative model where AI and human providers work together, each contributing their unique strengths. AI can process and analyze data at scales beyond human capability, while human providers bring empathy, ethical judgment, and the ability to consider the whole person—not just the data points.</p>
    
    <p>In this model, AI becomes a powerful tool that helps healthcare providers deliver more accurate diagnoses, more effective treatments, and more personalized care. The result could be a healthcare system that is not only more efficient but also more humane—one that uses technology to enhance the human connection at the heart of medicine.</p>
    
    <p>As we move forward, the key will be to develop and implement AI solutions thoughtfully, with careful attention to both their technical capabilities and their human impact. Done right, AI has the potential to transform healthcare for the better, making it more accurate, more accessible, and more personalized than ever before.</p>
  `,
  author: "Dhruv Agarwat",
  tags: ["Technology", "Healthcare", "AI"],
  read_time: 12,
  created_at: "2023-01-20T11:30:00Z",
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const supabase = getSupabaseClient() // Declare getSupabaseClient
        const { data, error } = await supabase.from("articles").select("*").eq("slug", params.slug).single()

        if (error) {
          console.error("Error fetching article:", error)
          return
        }

        if (data) {
          setArticle(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Comment out the actual fetch for now and use mock data
    // fetchArticle()
    setArticle(mockArticle)
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

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article not found</h1>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/articles" className="text-primary hover:underline mt-4 inline-block">
          Back to all articles
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(article.created_at).toLocaleDateString("en-US", {
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
        <Link href="/articles" className="hover:text-foreground">
          Articles
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{article.title}</span>
      </nav>

      {/* Article Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{article.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
          <div className="flex items-center gap-2">
            <span className="font-medium">By {article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{article.read_time} min read</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Article Image */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
          <Image
            src={article.image_url || "/placeholder.svg?height=500&width=1000"}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  )
}
