'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PhotoItem } from '@/lib/types'

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPhotos() {
      try {
        console.log('[v0] Fetching photography from API...')
        const res = await fetch('/api/photography')
        if (res.ok) {
          const data = await res.json()
          console.log('[v0] Photography fetched:', data)
          setPhotos(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching photography:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const downloadImage = (imageUrl: string, title: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${title}.jpg`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <p className="text-zinc-400">Loading gallery...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-white mb-12">Photography</h1>

        {/* Masonry Gallery */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl bg-zinc-900 h-fit"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative w-full h-auto">
                <Image
                  src={photo.image_url || "/placeholder.svg"}
                  alt={photo.title}
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  onLoad={(result) => {
                    const img = result.target as HTMLImageElement
                    const aspectRatio = img.naturalWidth / img.naturalHeight
                  }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end opacity-0 group-hover:opacity-100">
                <div className="p-4 w-full">
                  <h3 className="text-white font-semibold">{photo.title}</h3>
                  <p className="text-zinc-300 text-sm">{photo.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Viewer */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-10 right-0 text-white hover:text-zinc-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <Image
                src={selectedPhoto.image_url || "/placeholder.svg"}
                alt={selectedPhoto.title}
                width={1200}
                height={800}
                className="w-full h-auto object-contain rounded-lg"
              />

              <div className="mt-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPhoto.title}</h2>
                  <p className="text-zinc-400 mt-2">{selectedPhoto.description}</p>
                  <p className="text-sm text-zinc-500 mt-2">
                    📍 {selectedPhoto.location} | 📅 {new Date(selectedPhoto.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => downloadImage(selectedPhoto.image_url, selectedPhoto.title)}
                    className="bg-white hover:bg-zinc-200 text-black gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    onClick={() => window.open(selectedPhoto.image_url, '_blank')}
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Full
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
