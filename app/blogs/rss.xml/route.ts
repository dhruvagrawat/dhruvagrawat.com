import { allBlogs } from "@/content/blogs"
import { rss } from "@/lib/rss"
import { DATA } from "@/data/resume"

export const dynamic = "force-static"

export function GET() {
  return rss({ title: `${DATA.name} — Blog`, description: "Linux, Arch, open source and developer tools.", path: "/blogs", items: allBlogs })
}
