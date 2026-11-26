'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { photoSrc, type Photo } from '@/lib/photos'

const altText = (i: number) => `Photograph ${i + 1} from Dhruv Agrawat's treks and travels`

/**
 * Balanced masonry: each photo goes into the currently shortest column. Heights are
 * known up front (content/photos.json), so there is no layout shift while images load.
 */
function distribute(photos: Photo[], numCols: number) {
  const cols: { photo: Photo; idx: number }[][] = Array.from({ length: numCols }, () => [])
  const heights = new Array(numCols).fill(0)
  photos.forEach((photo, idx) => {
    const c = heights.indexOf(Math.min(...heights))
    cols[c].push({ photo, idx })
    heights[c] += photo.height / photo.width
  })
  return cols
}

/** Thumbnail that fades in once loaded – including images that finished before hydration. */
function Thumb({ photo, idx, priority }: { photo: Photo; idx: number; priority: boolean }) {
  const [loaded, setLoaded] = useState(false)
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth) setLoaded(true)
  }, [])
  return (
    <div className="pg-item-inner" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={photoSrc(photo.name, 'thumb')}
        alt={altText(idx)}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={loaded ? 'loaded' : ''}
      />
    </div>
  )
}

export function PhotographyGallery({ photos }: { photos: Photo[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [numCols, setNumCols] = useState(4)
  const touchX = useRef<number | null>(null)

  // Responsive column count
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setNumCols(w < 640 ? 2 : w < 1024 ? 3 : 4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const go = useCallback(
    (d: number) => setSelectedIdx((i) => (i === null ? i : Math.min(Math.max(i + d, 0), photos.length - 1))),
    [photos.length]
  )

  // Keyboard navigation + lock page scroll while the lightbox is open
  useEffect(() => {
    if (selectedIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIdx(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', handler)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = prev
    }
  }, [selectedIdx, go])

  // Preload the neighbours so arrowing through feels instant
  useEffect(() => {
    if (selectedIdx === null) return
    for (const i of [selectedIdx - 1, selectedIdx + 1]) {
      if (photos[i]) new Image().src = photoSrc(photos[i].name, 'web')
    }
  }, [selectedIdx, photos])

  if (photos.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-zinc-500 text-sm">
          No photos yet. Add some to <code>photos-raw/</code> and run <code>scripts/optimize-photos.py</code>.
        </p>
      </div>
    )
  }

  const selected = selectedIdx !== null ? photos[selectedIdx] : null
  const columns = distribute(photos, numCols)

  return (
    <>
      <style>{`
        .pg-item { cursor: pointer; margin-bottom: 4px; display: block; width: 100%; padding: 0; border: 0; background: none; }
        .pg-item-inner { position: relative; overflow: hidden; border-radius: 2px; background: #1c1c1e; }
        .pg-item-inner img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          opacity: 0; transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .pg-item-inner img.loaded { opacity: 1; }
        .pg-item:hover .pg-item-inner img { transform: scale(1.04); }
        .pg-item:focus-visible { outline: 2px solid hsl(var(--primary)); outline-offset: 2px; }
        @media (max-width: 639px) { .pg-grid { gap: 2px !important; } .pg-item { margin-bottom: 2px; } }
        @media (prefers-reduced-motion: reduce) { .pg-item-inner img, .lb-img, .lb-fade { transition: none; animation: none; } }
        .lb-fade { animation: lbFade 0.2s ease forwards; }
        .lb-img  { animation: lbImg 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes lbFade { from{opacity:0} to{opacity:1} }
        @keyframes lbImg  { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <div className="py-14 w-full">
        <div className="px-3 sm:px-4 mb-10">
          <p className="text-zinc-500 text-sm">{photos.length} photographs · tap any photo to open it</p>
        </div>

        <div className="w-full px-0 sm:px-4 flex pg-grid" style={{ gap: 4, alignItems: 'flex-start' }}>
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex-1 min-w-0 flex flex-col">
              {col.map(({ photo, idx }) => (
                <button
                  type="button"
                  key={photo.name}
                  className="pg-item"
                  aria-label={`Open ${altText(idx).toLowerCase()}`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <Thumb photo={photo} idx={idx} priority={idx < numCols * 2} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox – portalled to <body> so it sits above the dock (page content lives in a z-10 layer) */}
      {selected && selectedIdx !== null && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={altText(selectedIdx)}
          className="lb-fade fixed inset-0 z-[60] flex flex-col bg-black/95"
          onClick={() => setSelectedIdx(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
            touchX.current = null
          }}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 pt-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-zinc-400 font-mono text-xs tracking-widest">
              {selectedIdx + 1} / {photos.length}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={photoSrc(selected.name, 'full')}
                download={`dhruv-agrawat-${selected.name}.webp`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs tracking-widest uppercase transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedIdx(null)}
                className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-0 flex items-center justify-center px-2 sm:px-16 py-4">
            {selectedIdx > 0 && (
              <button
                type="button"
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:block text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={(e) => { e.stopPropagation(); go(-1) }}
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={selected.name}
              src={photoSrc(selected.name, 'web')}
              alt={altText(selectedIdx)}
              width={selected.width}
              height={selected.height}
              onClick={(e) => e.stopPropagation()}
              className="lb-img rounded max-w-full max-h-full w-auto h-auto object-contain shadow-2xl"
              // Show the already-cached thumbnail until the larger copy arrives
              style={{ backgroundImage: `url(${photoSrc(selected.name, 'thumb')})`, backgroundSize: 'cover' }}
            />
            {selectedIdx < photos.length - 1 && (
              <button
                type="button"
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:block text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={(e) => { e.stopPropagation(); go(1) }}
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>

          <p className="pb-5 text-center text-zinc-500 text-xs tracking-widest uppercase">
            <span className="hidden sm:inline">← → navigate · esc close</span>
            <span className="sm:hidden">swipe to navigate · tap outside to close</span>
          </p>
        </div>,
        document.body
      )}
    </>
  )
}
