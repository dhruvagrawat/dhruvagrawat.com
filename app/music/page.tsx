"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { MusicItem } from "@/lib/types"
import { MusicCard } from "@/components/music/music-card"
import { MusicPlayer } from "@/components/music/music-player"

// All data fetched from Supabase

export default function MusicPage() {
  const [musicItems, setMusicItems] = useState<MusicItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentTrack, setCurrentTrack] = useState<MusicItem | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)


  useEffect(() => {
    async function fetchMusicItems() {
      try {
        console.log("[v0] Fetching music from API...")
        const res = await fetch("/api/music")
        if (res.ok) {
          const data = await res.json()
          console.log("[v0] Music fetched:", data)
          setMusicItems(data)
        } else {
          console.error("[v0] API error:", res.status)
        }
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMusicItems()
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
            className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === null ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === tag ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
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
      {/* Music Player */}
      <div className="fixed bottom-0 inset-x-0 pb-24 sm:pb-0 ...">


        <MusicPlayer
          currentTrack={currentTrack}
          playlist={musicItems}
          autoPlay={shouldAutoPlay}
          onTrackChange={(track) => {
            setCurrentTrack(track)
            setShouldAutoPlay(true)
          }}
        />

      </div>

    </div>
  )
}
