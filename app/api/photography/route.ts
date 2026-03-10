import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif", "bmp", "tiff", "svg"])

export async function GET() {
  const dir = path.join(process.cwd(), "public", "photography")

  if (!fs.existsSync(dir)) {
    return NextResponse.json([])
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => !f.startsWith(".") && EXTENSIONS.has(f.split(".").pop()?.toLowerCase() ?? ""))

  return NextResponse.json(files)
}