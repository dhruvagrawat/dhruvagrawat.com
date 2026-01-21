"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Music } from "lucide-react"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { MusicItem } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/music/audio-player"

// Mock data for initial render
const mockMusicItem: MusicItem = {
  id: "1",
  title: "Midnight Serenity",
  slug: "midnight-serenity",
  image_url: "/placeholder.svg?height=500&width=500&text=Midnight+Serenity",
  tags: ["Lofi", "Instrumental", "Relaxing"],
  artist: "Dhruv Agarwat",
  audio_url: "/placeholder.mp3",
  album: "Midnight Sessions",
  duration: 180,
  created_at: "2023-01-05T20:30:00Z",
}

export default function MusicDetailPage({ params }: { params: { slug: string } }) {
  const [musicItem, setMusicItem] = useState<MusicItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMusicItem() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("music").select("*").eq("slug", params.slug).single()

        if (error) {
          console.error("Error fetching music item:", error)
          return
        }

        if (data) {
          setMusicItem(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Comment out the actual fetch for now and use mock data
    // fetchMusicItem()
    setMusicItem(mockMusicItem)
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

  if (!musicItem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Music not found</h1>
        <p>The music item you're looking for doesn't exist or has been removed.</p>
        <Link href="/music" className="text-primary hover:underline mt-4 inline-block">
          Back to all music
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/music" className="hover:text-foreground">
          Music
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{musicItem.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Music Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-black">
          <Image
            src={musicItem.image_url || "/placeholder.svg?height=500&width=500"}
            alt={musicItem.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-black/60 rounded-full p-6">
              <Music className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Music Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{musicItem.title}</h1>
          {musicItem.artist && <p className="text-xl text-muted-foreground mb-4">{musicItem.artist}</p>}

          <div className="flex flex-wrap gap-2 mb-6">
            {musicItem.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            {musicItem.album && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Album:</span>
                <span>{musicItem.album}</span>
              </div>
            )}
            {musicItem.duration && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Duration:</span>
                <span>
                  {Math.floor(musicItem.duration / 60)}:{(musicItem.duration % 60).toString().padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          {/* Audio Player */}
          {/* Audio Player */}
          {musicItem.audio_url && (
            <div className="fixed bottom-0 inset-x-0 pb-24 sm:pb-0 ...">

              <AudioPlayer audioUrl={musicItem.audio_url} title={musicItem.title} />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
