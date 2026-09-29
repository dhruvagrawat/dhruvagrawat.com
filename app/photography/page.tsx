import fs from "node:fs"
import path from "node:path"
import Link from "next/link"
import { DATA } from "@/data/resume"
import { personRef } from "@/lib/person"
import { PhotographyGallery } from "@/components/photography/gallery"

const EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif"])

// Read at build time: which photos exist (only those with optimised copies are shown).
function photoFiles() {
  const dir = path.join(process.cwd(), "public", "photography")
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => EXTENSIONS.has(f.split(".").pop()?.toLowerCase() ?? ""))
    .filter((f) => fs.existsSync(path.join(dir, "thumb", f.replace(/\.[^.]+$/, "") + ".webp")))
    .sort()
}

export default function PhotographyPage() {
  const files = photoFiles()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Photography by Dhruv Agrawat",
    url: `${DATA.url}/photography`,
    author: personRef,
    image: files.slice(0, 30).map((f) => `${DATA.url}/photography/web/${f.replace(/\.[^.]+$/, "")}.webp`),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="mx-auto max-w-4xl px-3 pt-4 sm:px-4">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Photography</p>
        <h1 className="text-5xl leading-[0.95] sm:text-7xl">
          Photographs from the <span className="italic">trail.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Snowy ridges, cloud-filled valleys, rivers and hill towns — pictures from my treks and travels in the Himalayas.
          The stories behind them live in my <Link href="/travel" className="text-primary underline-offset-4 hover:underline">travel journal</Link> and{" "}
          <Link href="/articles" className="text-primary underline-offset-4 hover:underline">articles</Link>.
        </p>
      </header>
      <PhotographyGallery files={files} />
    </>
  )
}
