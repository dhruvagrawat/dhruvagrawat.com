import Link from "next/link"
import { History } from "lucide-react"

// Top-right entry point to the /1999 retro version of the site (sits over the hero photo).
export default function TimeTravelButton() {
  return (
    <Link
      href="/1999"
      className="group absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-md transition-all hover:bg-black/35 sm:right-6 sm:top-6 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <History className="size-4 transition-transform duration-700 group-hover:-rotate-[360deg]" aria-hidden />
      <span>Go back in time</span>
      <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px]">1999</span>
    </Link>
  )
}
