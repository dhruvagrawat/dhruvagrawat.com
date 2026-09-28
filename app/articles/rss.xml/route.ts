import { allArticles } from "@/content/articles"
import { rss } from "@/lib/rss"
import { DATA } from "@/data/resume"

export const dynamic = "force-static"

export function GET() {
  return rss({ title: `${DATA.name} — Articles`, description: "Security, running an agency, and travelling India.", path: "/articles", items: allArticles })
}
