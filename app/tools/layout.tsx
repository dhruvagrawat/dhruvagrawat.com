import type { Metadata } from "next"
import { DATA } from "@/data/resume"
import { TOOLS } from "@/lib/tools"

const title = "Free Online Tools — JSON, Base64, UUID, QR, Currency & More"
const description =
  "Free, fast and ad-free web tools: JSON formatter, Base64 encoder, UUID and password generators, SHA-256 hashes, Unix timestamps, word counter, color converter, QR codes, currency converter and weather."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tools" },
  openGraph: { title, description, url: "/tools" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free online tools",
  itemListElement: TOOLS.filter((t) => !t.noindex && t.category !== "Services").map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    url: `${DATA.url}/${t.slug}`,
  })),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  )
}
