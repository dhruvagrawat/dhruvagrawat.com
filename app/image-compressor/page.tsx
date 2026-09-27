/* eslint-disable @next/next/no-img-element */
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Download, ImageIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Segmented } from "@/components/tools/calc-ui"

type Fmt = "image/jpeg" | "image/webp" | "image/png"
const EXT: Record<Fmt, string> = { "image/jpeg": "jpg", "image/webp": "webp", "image/png": "png" }

const kb = (b: number) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`)

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [srcUrl, setSrcUrl] = useState("")
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fmt, setFmt] = useState<Fmt>("image/webp")
  const [quality, setQuality] = useState(75)
  const [maxW, setMaxW] = useState(1920)
  const [out, setOut] = useState<{ url: string; size: number; w: number; h: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)
  const outUrlRef = useRef("")

  const load = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, WebP, GIF…).")
      return
    }
    setError("")
    setFile(f)
    if (srcUrl) URL.revokeObjectURL(srcUrl)
    const url = URL.createObjectURL(f)
    setSrcUrl(url)
    const im = new Image()
    im.onload = () => {
      setImg(im)
      setMaxW(Math.min(im.naturalWidth, 1920))
    }
    im.onerror = () => setError("This image couldn't be read by your browser (HEIC isn't supported in most browsers).")
    im.src = url
  }

  const compress = useCallback(() => {
    if (!img) return
    setBusy(true)
    const scale = Math.min(1, maxW / img.naturalWidth)
    const w = Math.max(1, Math.round(img.naturalWidth * scale))
    const h = Math.max(1, Math.round(img.naturalHeight * scale))
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")!
    if (fmt === "image/jpeg") {
      ctx.fillStyle = "#ffffff" // JPEG has no transparency
      ctx.fillRect(0, 0, w, h)
    }
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(img, 0, 0, w, h)
    canvas.toBlob(
      (blob) => {
        setBusy(false)
        if (!blob) {
          setError("Your browser couldn't encode this format — try JPEG.")
          return
        }
        if (outUrlRef.current) URL.revokeObjectURL(outUrlRef.current)
        const url = URL.createObjectURL(blob)
        outUrlRef.current = url
        setOut({ url, size: blob.size, w, h })
      },
      fmt,
      fmt === "image/png" ? undefined : quality / 100
    )
  }, [img, fmt, quality, maxW])

  // re-compress (debounced) whenever settings change
  useEffect(() => {
    if (!img) return
    const t = setTimeout(compress, 150)
    return () => clearTimeout(t)
  }, [img, compress])

  useEffect(
    () => () => {
      if (outUrlRef.current) URL.revokeObjectURL(outUrlRef.current)
    },
    []
  )

  const saved = file && out ? 1 - out.size / file.size : 0
  const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "image"

  return (
    <div className="space-y-5">
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files?.[0]
          if (f) load(f)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "hover:bg-muted/40"
        }`}
      >
        <Upload className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">{file ? "Choose another image" : "Drop an image here or click to choose"}</span>
        <span className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF · stays on your device</span>
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {img && (
        <>
          <div className="rounded-xl border bg-card p-5 space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium">Output format</p>
              <Segmented
                label="Output format"
                value={fmt}
                onChange={setFmt}
                options={[
                  { value: "image/webp", label: "WebP (smallest)" },
                  { value: "image/jpeg", label: "JPEG" },
                  { value: "image/png", label: "PNG (lossless)" },
                ]}
              />
            </div>
            {fmt !== "image/png" && (
              <label className="block space-y-2">
                <span className="flex justify-between text-sm font-medium">
                  Quality <span className="tabular-nums text-muted-foreground">{quality}%</span>
                </span>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-primary" />
              </label>
            )}
            <label className="block space-y-2">
              <span className="flex justify-between text-sm font-medium">
                Max width{" "}
                <span className="tabular-nums text-muted-foreground">
                  {maxW}px {maxW >= img.naturalWidth ? "(original)" : ""}
                </span>
              </span>
              <input
                type="range"
                min={Math.min(100, img.naturalWidth)}
                max={img.naturalWidth}
                step={10}
                value={maxW}
                onChange={(e) => setMaxW(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <figure className="rounded-xl border bg-card overflow-hidden">
              <div className="flex h-56 items-center justify-center bg-[conic-gradient(#8881_25%,transparent_0_50%,#8881_0_75%,transparent_0)] bg-[length:16px_16px]">
                <img src={srcUrl} alt="Original" className="max-h-full max-w-full object-contain" />
              </div>
              <figcaption className="flex justify-between px-3 py-2 text-xs text-muted-foreground">
                <span>Original · {img.naturalWidth}×{img.naturalHeight}</span>
                <span className="tabular-nums">{file && kb(file.size)}</span>
              </figcaption>
            </figure>
            <figure className="rounded-xl border bg-card overflow-hidden">
              <div className={`flex h-56 items-center justify-center bg-[conic-gradient(#8881_25%,transparent_0_50%,#8881_0_75%,transparent_0)] bg-[length:16px_16px] ${busy ? "opacity-60" : ""}`}>
                {out ? <img src={out.url} alt="Compressed" className="max-h-full max-w-full object-contain" /> : <ImageIcon className="size-6 text-muted-foreground" />}
              </div>
              <figcaption className="flex justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">{out ? `Compressed · ${out.w}×${out.h}` : "Compressing…"}</span>
                {out && (
                  <span className={`tabular-nums font-medium ${saved > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"}`}>
                    {kb(out.size)} ({saved > 0 ? `−${Math.round(saved * 100)}%` : `+${Math.round(-saved * 100)}%`})
                  </span>
                )}
              </figcaption>
            </figure>
          </div>

          {out && saved <= 0 && (
            <p className="text-xs text-amber-600">
              The result is larger than the original — try WebP, a lower quality, or a smaller width.
            </p>
          )}

          {out && (
            <Button asChild className="gap-2">
              <a href={out.url} download={`${baseName}-compressed.${EXT[fmt]}`}>
                <Download className="size-4" /> Download {EXT[fmt].toUpperCase()} ({kb(out.size)})
              </a>
            </Button>
          )}
        </>
      )}
    </div>
  )
}
