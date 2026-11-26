import manifest from "@/content/photos.json"

/** One photo, as written to content/photos.json by scripts/optimize-photos.py */
export type Photo = { name: string; width: number; height: number }

export const photos: Photo[] = manifest

/** Optimised copies: thumb 640px (grid), web 1600px (lightbox), full 2560px (download) */
export const photoSrc = (name: string, size: "thumb" | "web" | "full") => `/photography/${size}/${name}.webp`
