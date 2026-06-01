"use client"

import { useState } from "react"
import type { MusicMeta } from "@/content/types"
import { MusicCard } from "./music-card"
import { MusicPlayer } from "./music-player"

interface MusicPageClientProps {
  tracks: MusicMeta[]
}

export function MusicPageClient({ tracks }: MusicPageClientProps) {
  const [currentTrack, setCurrentTrack] = useState<MusicMeta | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)

  const allTags = Array.from(new Set(tracks.flatMap((t) => t.tags)))
  const filtered = selectedTag ? tracks.filter((t) => t.tags.includes(selectedTag)) : tracks

  return (
    <div className="pb-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Music</h1>

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

        {filtered.length === 0 ? (
          <p className="text-muted-foreground">No tracks yet — check back soon.</p>
        ) : (
          <div className="music-grid">
            {filtered.map((track) => (
              <MusicCard
                key={track.slug}
                music={track}
                isPlaying={currentTrack?.slug === track.slug}
                onClick={() => {
                  setCurrentTrack(track)
                  setShouldAutoPlay(true)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <MusicPlayer
        currentTrack={currentTrack}
        playlist={tracks}
        autoPlay={shouldAutoPlay}
        onTrackChange={(track) => {
          setCurrentTrack(track)
          setShouldAutoPlay(true)
        }}
      />
    </div>
  )
}
