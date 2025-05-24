"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { MusicItem } from "@/lib/types"
import { MusicCard } from "@/components/music/music-card"
import { MusicPlayer } from "@/components/music/music-player"

// Mock data for initial render
const mockMusicItems: MusicItem[] = [
  {
    id: "1",
    title: "Midnight Serenity",
    slug: "midnight-serenity",
    image_url: "/placeholder.svg?height=300&width=300&text=Midnight+Serenity",
    tags: ["Lofi", "Instrumental", "Relaxing"],
    artist: "Dhruv Agarwat",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    album: "Midnight Sessions",
    duration: 180,
    created_at: "2023-01-05T20:30:00Z",
  },
  {
    id: "2",
    title: "Urban Dreams",
    slug: "urban-dreams",
    image_url: "/placeholder.svg?height=300&width=300&text=Urban+Dreams",
    tags: ["Electronic", "Ambient", "Chill"],
    artist: "Dhruv Agarwat",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    album: "City Lights",
    duration: 210,
    created_at: "2023-02-12T15:45:00Z",
  },
  {
    id: "3",
    title: "Rainy Day",
    slug: "rainy-day",
    image_url: "/placeholder.svg?height=300&width=300&text=Rainy+Day",
    tags: ["Piano", "Instrumental", "Melancholic"],
    artist: "Dhruv Agarwat",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    album: "Weather Moods",
    duration: 195,
    created_at: "2023-03-20T18:15:00Z",
  },
  {
    id: "4",
    title: "Morning Meditation",
    slug: "morning-meditation",
    image_url: "/placeholder.svg?height=300&width=300&text=Morning+Meditation",
    tags: ["Ambient", "Meditation", "Peaceful"],
    artist: "Dhruv Agarwat",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    album: "Mindful Moments",
    duration: 300,
    created_at: "2023-04-08T07:30:00Z",
  },
  {
    id: "5",
    title: "Sunset Groove",
    slug: "sunset-groove",
    image_url: "/placeholder.svg?height=300&width=300&text=Sunset+Groove",
    tags: ["Jazz", "Funk", "Upbeat"],
    artist: "Dhruv Agarwat",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    album: "Evening Sessions",
    duration: 240,
    created_at: "2023-05-15T19:20:00Z",
  },
  {
    id: "6",
    title: "Forest Whispers",
    slug: "forest-whispers",
    image_url: "/placeholder.svg?height=300&width=300&text=Forest+Whispers",
    tags: ["Nature", "Ambient", "Relaxing"],
    artist: "Dhruv Agarwat",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    album: "Natural Sounds",
    duration: 270,
    created_at: "2023-06-22T14:10:00Z",
  },
]

export default function MusicPage() {
  const [musicItems, setMusicItems] = useState<MusicItem[]>(mockMusicItems)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTrack, setCurrentTrack] = useState<MusicItem | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMusicItems() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("music").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching music items:", error)
          return
        }

        if (data) {
          setMusicItems(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Use mock data for now
    setIsLoading(false)
  }, [])

  // Get all unique tags from music items
  const allTags = Array.from(new Set(musicItems.flatMap((item) => item.tags)))

  // Filter music items by selected tag
  const filteredMusicItems = selectedTag ? musicItems.filter((item) => item.tags.includes(selectedTag)) : musicItems

  return (
    <div className="pb-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Music</h1>

        {/* Tags filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTag === null ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === tag ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="music-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-zinc-800 rounded-md mb-2"></div>
                <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="music-grid">
            {filteredMusicItems.map((music) => (
              <MusicCard
                key={music.id}
                music={music}
                isPlaying={currentTrack?.id === music.id}
                onClick={() => setCurrentTrack(music)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Music Player */}
      <MusicPlayer
        currentTrack={currentTrack}
        playlist={musicItems}
        onTrackChange={(track) => setCurrentTrack(track)}
      />
    </div>
  )
}
