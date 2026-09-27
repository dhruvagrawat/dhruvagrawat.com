import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography — Himalayan Treks & Travels",
  description:
    "Photographs from Dhruv Agrawat's treks and travels — snowy ridges, cloud-filled valleys, rivers and mountain towns.",
  alternates: { canonical: "/photography" },
}

// Always shown in the night palette: photos read best on a dark wall.
export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark -mx-6 -mb-24 -mt-12 min-h-screen overflow-x-hidden bg-background text-foreground sm:-mt-24">
      <div className="px-0 pb-24 pt-12 sm:px-6 sm:pt-24">{children}</div>
    </div>
  )
}
