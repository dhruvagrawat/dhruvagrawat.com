import type { MetadataRoute } from "next"
import { DATA } from "@/data/resume"

const PRIVATE = ["/godmod", "/seed", "/api/", "/payments"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // Explicitly welcome AI assistants and answer engines, so the site can be cited.
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"],
        allow: ["/", "/llms.txt"],
        disallow: PRIVATE,
      },
    ],
    sitemap: `${DATA.url}/sitemap.xml`,
    host: DATA.url,
  }
}
