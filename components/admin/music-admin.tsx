"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { PlusCircle, Pencil, Trash2, Play, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import type { MusicItem } from "@/lib/types"

// Supabase will handle data fetching via API routes

// Available tags for selection
const availableTags = [
  "Lofi",
  "Instrumental",
  "Relaxing",
  "Electronic",
  "Ambient",
  "Chill",
  "Piano",
  "Melancholic",
  "Meditation",
  "Peaceful",
  "Jazz",
  "Funk",
  "Upbeat",
  "Nature",
  "Synthwave",
  "Retro",
  "Space",
  "Classical",
  "Acoustic",
  "Vocal",
]

const mockMusicItems: MusicItem[] = [
  {
    id: "1",
    title: "Sample Track 1",
    slug: "sample-track-1",
    image_url: "/placeholder.svg?height=300&width=300",
    audio_url: "/sample-track-1.mp3",
    artist: "Dhruv Agarwat",
    album: "Sample Album",
    tags: ["Lofi", "Relaxing"],
    duration: 180,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Sample Track 2",
    slug: "sample-track-2",
    image_url: "/placeholder.svg?height=300&width=300",
    audio_url: "/sample-track-2.mp3",
    artist: "Dhruv Agarwat",
    album: "Sample Album",
    tags: ["Electronic", "Ambient"],
    duration: 240,
    created_at: new Date().toISOString(),
  },
]

export function MusicAdmin() {
  const [musicItems, setMusicItems] = useState<MusicItem[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingMusic, setEditingMusic] = useState<MusicItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [previewAudio, setPreviewAudio] = useState<string | null>(null)

  // Fetch music from API on component mount
  useEffect(() => {
    fetchMusic()
  }, [])

  const fetchMusic = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/music")
      if (!res.ok) throw new Error("Failed to fetch music")
      const data = await res.json()
      setMusicItems(data)
    } catch (error) {
      console.error("Error fetching music:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Form state
  const [formData, setFormData] = useState<Partial<MusicItem>>({
    title: "",
    image_url: "",
    audio_url: "",
    artist: "Dhruv Agarwat",
    album: "",
    tags: [],
    duration: 0,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      image_url: "",
      audio_url: "",
      artist: "Dhruv Agarwat",
      album: "",
      tags: [],
      duration: 0,
    })
    setEditingMusic(null)
    setIsAddingNew(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => {
      const currentTags = prev.tags || []
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter((t) => t !== tag) }
      } else {
        return { ...prev, tags: [...currentTags, tag] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const slug =
        formData.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") || ""

      const musicData = {
        title: formData.title || "Untitled Track",
        slug,
        image_url: formData.image_url || "",
        audio_url: formData.audio_url || "",
        artist: formData.artist || "",
        album: formData.album || "",
        tags: formData.tags || [],
        duration: Number(formData.duration) || 0,
      }

      if (editingMusic) {
        const res = await fetch(`/api/music/${editingMusic.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(musicData),
        })
        if (!res.ok) throw new Error("Failed to update music")
      } else {
        const res = await fetch("/api/music", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(musicData),
        })
        if (!res.ok) throw new Error("Failed to create music")
      }

      await fetchMusic()
      resetForm()
    } catch (error) {
      console.error("Error saving music:", error)
      alert("Error saving music. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (music: MusicItem) => {
    setEditingMusic(music)
    setFormData({
      title: music.title,
      image_url: music.image_url,
      audio_url: music.audio_url,
      artist: music.artist,
      album: music.album,
      tags: music.tags,
      duration: music.duration,
    })
    setIsAddingNew(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this track?")) return

    try {
      const res = await fetch(`/api/music/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete music")
      await fetchMusic()
    } catch (error) {
      console.error("Error deleting music:", error)
      alert("Error deleting music. Please try again.")
    }
  }

  const togglePreviewAudio = (audioUrl: string) => {
    if (previewAudio === audioUrl) {
      setPreviewAudio(null)
    } else {
      setPreviewAudio(audioUrl)
    }
  }

  return (
    <div>
      {!isAddingNew ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Music</h2>
            <Button onClick={() => setIsAddingNew(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Track
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-zinc-400">Loading music...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {musicItems.length === 0 ? (
                <p className="text-zinc-400 col-span-full">No tracks yet. Create one to get started.</p>
              ) : musicItems.map((music) => (
                <Card key={music.id} className="admin-card bg-zinc-900 border-zinc-800">
                  <div className="relative aspect-square">
                    <Image
                      src={music.image_url || "/placeholder.svg?height=300&width=300"}
                      alt={music.title}
                      fill
                      className="object-cover rounded-t-md"
                    />
                    {music.audio_url && (
                      <button
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                        onClick={() => togglePreviewAudio(music.audio_url || "")}
                      >
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-full">
                          {previewAudio === music.audio_url ? (
                            <Music className="h-6 w-6 text-white" />
                          ) : (
                            <Play className="h-6 w-6 text-white" />
                          )}
                        </div>
                      </button>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{music.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-zinc-400">{music.artist}</p>
                    {music.album && <p className="text-xs text-zinc-500">{music.album}</p>}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {music.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {music.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{music.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(music)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(music.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {previewAudio && (
            <div className="fixed bottom-[88px] left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 flex items-center gap-4 z-40">

              <Button variant="ghost" size="icon" onClick={() => setPreviewAudio(null)}>
                <Music className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <audio src={previewAudio} controls autoPlay className="w-full" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{editingMusic ? "Edit Track" : "Add New Track"}</h2>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="artist">Artist</Label>
                  <Input
                    id="artist"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div>
                  <Label htmlFor="album">Album</Label>
                  <Input
                    id="album"
                    name="album"
                    value={formData.album}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Cover Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="audio_url">Audio File URL</Label>
                  <Input
                    id="audio_url"
                    name="audio_url"
                    value={formData.audio_url}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="https://example.com/audio.mp3"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    min="0"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={formData.tags?.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-zinc-800 rounded-lg p-6">
                <div className="relative w-64 h-64 mb-6">
                  <Image
                    src={formData.image_url || "/placeholder.svg?height=300&width=300&text=Album+Cover"}
                    alt="Album Cover Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {formData.audio_url && (
                  <div className="w-full">
                    <Label htmlFor="audio-preview">Audio Preview</Label>
                    <audio id="audio-preview" src={formData.audio_url} controls className="w-full mt-2" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingMusic ? "Update Track" : "Add Track"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
