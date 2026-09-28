import { allMusic } from "@/content/music"
import { MusicPageClient } from "@/components/music/music-page-client"

export const metadata = {
  title: "Music",
  description: "Original music and tracks produced by Dhruv Agrawat — lo-fi and instrumental pieces made alongside code and travel.",
  alternates: { canonical: "/music" },
  // Placeholder content only for now — kept out of search until real tracks are added.
  robots: { index: false, follow: true },
}

export default function MusicPage() {
  return <MusicPageClient tracks={allMusic} />
}
