import Link from "next/link"
import { DATA } from "@/data/resume"
import { personRef } from "@/lib/person"
import { PhotographyGallery } from "@/components/photography/gallery"
import { photos, photoSrc } from "@/lib/photos"

export default function PhotographyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Photography by Dhruv Agrawat",
    url: `${DATA.url}/photography`,
    author: personRef,
    image: photos.slice(0, 30).map((p) => `${DATA.url}${photoSrc(p.name, "web")}`),
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
      <PhotographyGallery photos={photos} />
    </>
  )
}
