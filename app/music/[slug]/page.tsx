import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/music/audio-player"
import { allMusic, getMusicBySlug } from "@/content/music"

export async function generateStaticParams() {
  return allMusic.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const track = getMusicBySlug(slug)
  if (!track) return {}
  return { title: `${track.title} | Music`, description: track.artist }
}

export default async function MusicDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const track = getMusicBySlug(slug)
  if (!track) notFound()

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/music" className="hover:text-foreground">Music</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{track.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900">
          <Image
            src={track.coverImage || "/placeholder.svg?height=500&width=500"}
            alt={track.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{track.title}</h1>
            {track.artist && <p className="text-xl text-muted-foreground">{track.artist}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {track.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            {track.album && (
              <p><span className="text-foreground font-medium">Album</span> · {track.album}</p>
            )}
            {track.duration && (
              <p><span className="text-foreground font-medium">Duration</span> · {formatDuration(track.duration)}</p>
            )}
          </div>

          {track.audioUrl && (
            <div className="mt-4">
              <AudioPlayer audioUrl={track.audioUrl} title={track.title} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12 pt-8 border-t">
        <Link href="/music" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to all music
        </Link>
      </div>
    </div>
  )
}
