import { allMusic } from "@/content/music"
import { MusicPageClient } from "@/components/music/music-page-client"

export const metadata = {
  title: "Music | Dhruv Agrawat",
  description: "Original music and tracks I've produced.",
}

export default function MusicPage() {
  return <MusicPageClient tracks={allMusic} />
}
