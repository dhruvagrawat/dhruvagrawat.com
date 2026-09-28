import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Page not found", robots: { index: false } }

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blog" },
  { href: "/articles", label: "Articles" },
  { href: "/resipy", label: "Recipes" },
  { href: "/tools", label: "Free tools" },
  { href: "/travel", label: "Travel journal" },
]

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center py-16">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">404 · Off the trail</p>
      <h1 className="text-5xl leading-[0.95] sm:text-7xl">
        This path doesn&apos;t <span className="italic">go anywhere.</span>
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        The page may have moved, or the link had a typo. Here are some well-marked trails instead:
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
