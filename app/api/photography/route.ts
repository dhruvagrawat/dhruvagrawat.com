import { NextResponse } from "next/server"
import { photos, photoSrc } from "@/lib/photos"

export const dynamic = "force-static"

// Public list of photos with their optimised URLs (originals are never deployed).
export function GET() {
  return NextResponse.json(
    photos.map((p) => ({ ...p, thumb: photoSrc(p.name, "thumb"), web: photoSrc(p.name, "web"), full: photoSrc(p.name, "full") }))
  )
}
