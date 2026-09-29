import { DATA } from "@/data/resume"
import { oneLiner } from "@/lib/person"
import { aboutMarkdown, markdownResponse } from "@/lib/llms"
import { TOOLS } from "@/lib/tools"
import { allBlogs } from "@/content/blogs"
import { allArticles } from "@/content/articles"
import { allRecipes } from "@/content/recipes"
import { isIndexable, publishedPlaces } from "@/content/travel/places"

export const dynamic = "force-static"

// /llms.txt — a plain-markdown summary of the site for AI assistants and LLM crawlers
// (see https://llmstxt.org). Generated from the same data as the site, so it never drifts.
export function GET() {
  const u = DATA.url
  const socials = Object.values(DATA.contact.social).filter((s) => s.url.startsWith("http"))
  const tools = TOOLS.filter((t) => !t.noindex && t.category !== "Services")

  const md = `# ${DATA.name}

> ${oneLiner} ${DATA.description}

This file summarises the site for AI assistants (https://llmstxt.org). The full text of every post, guide, recipe and travel story is in ${u}/llms-full.txt.

${aboutMarkdown()}
## Pages
- [Home](${u}/): profile, work history, projects and contact
- [About](${u}/about): who Dhruv Agrawat is — experience, skills, education, writing, travel and FAQs
- [Projects](${u}/projects)
- [Blogs](${u}/blogs) and [Articles](${u}/articles)
- [Photography](${u}/photography): photos from Himalayan treks and travels
- [Travel journal](${u}/travel): interactive globe of places visited and a travel wishlist
- [Free tools](${u}/tools)
- [Status](${u}/status): live uptime of Dhruv's sites and services
${allBlogs.map((b) => `- [${b.title}](${u}/blogs/${b.slug}): ${b.description}`).join("\n")}
${allArticles.map((a) => `- [${a.title}](${u}/articles/${a.slug}): ${a.description}`).join("\n")}

## Recipes
${allRecipes.map((r) => `- [${r.title}](${u}/resipy/${r.slug}) (${r.cuisine ?? r.category}${r.vegetarian ? ", vegetarian" : ""}): ${r.description}`).join("\n")}

## Travel journal
${publishedPlaces.filter(isIndexable).map((p) => `- [${p.name}, ${p.country}](${u}/travel/${p.slug}) (${p.status === "visited" ? "visited" : "wishlist"}): ${p.summary}`).join("\n")}

## Free tools (no sign-up, most run entirely in the browser)
${tools.map((t) => `- [${t.label}](${u}/${t.slug}): ${t.blurb}`).join("\n")}

## Elsewhere
${socials.map((s) => `- ${s.name}: ${s.url}`).join("\n")}
`
  return markdownResponse(md)
}
