import { publishedPlaces } from "@/content/travel/places"
import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "Travel journal entry"

export function generateStaticParams() {
  return publishedPlaces.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = publishedPlaces.find((x) => x.slug === slug)
  return postOgImage({
    kicker: p ? `${p.region}, ${p.country}` : "Travel journal",
    title: p?.name ?? "Travel journal",
    footer: p?.status === "wishlist" ? "On my wishlist" : "Travel journal",
  })
}
