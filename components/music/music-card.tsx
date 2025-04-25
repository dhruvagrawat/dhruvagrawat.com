"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import type { MusicItem } from "@/lib/types"

interface MusicCardProps {
  music: MusicItem
  isPlaying: boolean
  onClick: () => void
}

export function MusicCard({ music, isPlaying, onClick }: MusicCardProps) {
  return (
    <div
      className={`music-card bg-zinc-900 rounded-md overflow-hidden cursor-pointer transition-all ${
        isPlaying ? "playing" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-square group">
        <Image
          src={music.image_url || "/placeholder.svg?height=300&width=300"}
          alt={music.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div
            className={`rounded-full p-3 ${
              isPlaying ? "bg-[#1DB954] text-black" : "bg-white/10 backdrop-blur-md text-white"
            }`}
          >
            <Play className="h-6 w-6" fill={isPlaying ? "currentColor" : "none"} />
          </div>
        </div>
        {isPlaying && (
          <div className="absolute bottom-2 right-2">
            <div className="bg-[#1DB954] text-black text-xs font-medium px-2 py-1 rounded-full">Playing</div>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{music.title}</h3>
        <p className="text-zinc-400 text-xs truncate mt-1">{music.artist}</p>
      </div>
    </div>
  )
}
