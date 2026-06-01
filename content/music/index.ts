import type { MusicMeta } from "@/content/types"

// ── Add each track here ───────────────────────────────────────────────────
export const allMusic: MusicMeta[] = [
  {
    slug: "midnight-serenity",
    title: "Midnight Serenity",
    artist: "Dhruv Agrawat",
    album: "Midnight Sessions",
    tags: ["Lofi", "Instrumental", "Relaxing"],
    duration: 180,
    coverImage: "/placeholder.svg?height=500&width=500&text=Midnight+Serenity",
    audioUrl: "/placeholder.mp3",
    date: "2025-01-05",
  },
  // add more tracks here
]

export function getMusicBySlug(slug: string): MusicMeta | undefined {
  return allMusic.find((m) => m.slug === slug)
}
