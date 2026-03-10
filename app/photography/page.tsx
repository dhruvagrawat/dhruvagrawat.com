'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Download, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

interface PhotoItem {
  id: string
  src: string
  title: string
  filename: string
  aspectRatio: number  // locked in before image loads — prevents layout shift
  imgLoaded: boolean
}

const EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'svg'])

// Deterministic aspect ratio seed from filename so skeleton shape is stable
function seedAspect(filename: string): number {
  let h = 0
  for (let i = 0; i < filename.length; i++) h = (Math.imul(31, h) + filename.charCodeAt(i)) | 0
  const ratios = [0.75, 0.8, 1.0, 1.25, 1.33, 1.5, 1.6, 1.78]
  return ratios[Math.abs(h) % ratios.length]
}

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    fetch('/api/photography')
      .then((r) => r.json())
      .then((filenames: string[]) => {
        if (!Array.isArray(filenames)) return
        const filtered = filenames.filter((f) =>
          EXTENSIONS.has(f.split('.').pop()?.toLowerCase() ?? '')
        )
        const items: PhotoItem[] = filtered.map((filename, i) => ({
          id: String(i),
          src: `/photography/${filename}`,
          title: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          filename,
          aspectRatio: seedAspect(filename), // stable placeholder shape
          imgLoaded: false,
        }))
        setPhotos(items)
        // Reveal first 8 immediately (above fold)
        setRevealedIds(new Set(items.slice(0, 8).map((p) => p.id)))
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  // Scroll-reveal: mandatory 1s suspense before showing each item
  useEffect(() => {
    if (photos.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const id = (entry.target as HTMLElement).dataset.photoid
          if (!id) return
          observer.unobserve(entry.target)
          setTimeout(() => {
            setRevealedIds((prev) => new Set([...prev, id]))
          }, 1000)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    itemRefs.current.forEach((el, id) => {
      if (!revealedIds.has(id)) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [photos])

  // Update true aspect ratio once image loads — but layout won't shift because
  // the container is already sized via padding-bottom trick
  const handleImgLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const ar = img.naturalWidth / img.naturalHeight || 1
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, aspectRatio: ar, imgLoaded: true } : p))
    )
  }

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedIdx === null) return
      if (e.key === 'Escape') setSelectedIdx(null)
      if (e.key === 'ArrowRight') setSelectedIdx((i) => Math.min((i ?? 0) + 1, photos.length - 1))
      if (e.key === 'ArrowLeft') setSelectedIdx((i) => Math.max((i ?? 0) - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedIdx, photos.length])

  const selectedPhoto = selectedIdx !== null ? photos[selectedIdx] : null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400 text-sm tracking-widest uppercase animate-pulse">Loading…</p>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500 text-sm">
          No photos found in <code className="text-zinc-300">public/photography/</code>
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        /* Skeleton shimmer */
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .pg-skeleton {
          background: linear-gradient(90deg, #1c1c1e 25%, #2c2c2e 50%, #1c1c1e 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s ease-in-out infinite;
          position: absolute;
          inset: 0;
          transition: opacity 0.4s ease;
        }
        .pg-skeleton.hidden-skel { opacity: 0; pointer-events: none; }

        /* Card */
        .pg-item {
          cursor: pointer;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1),
                      transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .pg-item.revealed { opacity: 1; transform: none; }

        /* Inner: padding-bottom trick locks height before image loads */
        .pg-item-inner {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
          background: #1c1c1e;
        }
        .pg-aspect-box {
          width: 100%;
          height: 0;
          /* padding-bottom set inline per photo */
        }
        .pg-item-inner img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 0.5s ease,
                      transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .pg-item-inner img.loaded { opacity: 1; }
        .pg-item:hover .pg-item-inner img { transform: scale(1.04); }

        .pg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 10px;
          pointer-events: none;
        }
        .pg-item:hover .pg-overlay { opacity: 1; }

        /* Lightbox */
        .lb-fade { animation: lbFade 0.25s ease forwards; }
        .lb-img  { animation: lbImg 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes lbFade { from { opacity:0 } to { opacity:1 } }
        @keyframes lbImg  { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
      `}</style>

      <div className="min-h-screen py-14 w-full">
        <div className="px-4 mb-10">
          <h1 className="text-4xl font-bold text-white">Photography</h1>
          <p className="text-zinc-500 text-sm mt-1">{photos.length} images</p>
        </div>

        {/* CSS Grid — left-to-right, top-to-bottom flow */}
        <div
          className="w-full px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          style={{ gap: 4 }}
        >
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              ref={(el) => { if (el) itemRefs.current.set(photo.id, el) }}
              data-photoid={photo.id}
              className={`pg-item${revealedIds.has(photo.id) ? ' revealed' : ''}`}
              style={{ transitionDelay: revealedIds.has(photo.id) ? `${(idx % 4) * 80}ms` : '0ms' }}
              onClick={() => setSelectedIdx(idx)}
            >
              <div className="pg-item-inner">
                {/* Aspect-ratio box: locks height from the start — zero reflow */}
                <div
                  className="pg-aspect-box"
                  style={{ paddingBottom: `${(1 / photo.aspectRatio) * 100}%` }}
                />
                {/* Shimmer skeleton — hides once image is loaded */}
                <div className={`pg-skeleton${photo.imgLoaded ? ' hidden-skel' : ''}`} />
                {/* Actual image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  onLoad={(e) => handleImgLoad(photo.id, e)}
                  className={photo.imgLoaded ? 'loaded' : ''}
                />
                <div className="pg-overlay">
                  <p className="text-white text-xs capitalize truncate w-full tracking-wide">
                    {photo.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="lb-fade fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.96)' }}
          onClick={() => setSelectedIdx(null)}
        >
          {selectedIdx! > 0 && (
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/8 border-0 bg-transparent cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setSelectedIdx((i) => (i ?? 1) - 1) }}
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}
          {selectedIdx! < photos.length - 1 && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/8 border-0 bg-transparent cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setSelectedIdx((i) => (i ?? 0) + 1) }}
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}

          <div
            className="flex flex-col w-full h-full px-14 pt-5 pb-28"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between flex-shrink-0 mb-3">
              <div>
                <p className="text-zinc-600 text-xs tracking-widest uppercase">
                  {(selectedIdx ?? 0) + 1} / {photos.length}
                </p>
                <h2 className="text-xl font-semibold text-white capitalize mt-0.5">
                  {selectedPhoto.title}
                </h2>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedIdx(null)}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedIdx(null)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={selectedPhoto.src}
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="lb-img rounded object-contain"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                }}
              />
            </div>

            <div className="flex-shrink-0 mt-3 flex items-center justify-between flex-wrap gap-2">
              <p className="text-zinc-700 text-xs tracking-widest uppercase hidden sm:block">
                ← → navigate · esc close
              </p>
              <div className="flex gap-2 ml-auto">
                <a
                  href={selectedPhoto.src}
                  download={selectedPhoto.filename}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/18 text-white/70 hover:text-white text-xs tracking-widest uppercase transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
                <a
                  href={selectedPhoto.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-white/25 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Full Res
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}