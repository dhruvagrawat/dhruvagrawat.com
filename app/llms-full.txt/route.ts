import { DATA } from "@/data/resume"
import { allBlogs } from "@/content/blogs"
import { allArticles } from "@/content/articles"
import { allRecipes } from "@/content/recipes"
import { isIndexable, publishedPlaces } from "@/content/travel/places"
import { oneLiner } from "@/lib/person"
import { aboutMarkdown, demoteHeadings, markdownResponse } from "@/lib/llms"

export const dynamic = "force-static"

// /llms-full.txt — the complete text of the site's writing in one Markdown file, so AI
// assistants can read and cite it accurately without crawling every page.
export function GET() {
  const u = DATA.url
  const hr = "\n\n---\n\n"

  const posts = (kind: string, base: string, items: typeof allBlogs) =>
    items
      .filter((p) => p.body)
      .map(
        (p) =>
          `## ${p.title}\n\nURL: ${u}${base}/${p.slug}\nType: ${kind}${p.category ? ` · ${p.category}` : ""}\nAuthor: ${DATA.name}\nPublished: ${p.date}${p.updated ? ` · Updated: ${p.updated}` : ""}\nSummary: ${p.description}\n\n${demoteHeadings(p.body!)}`
      )
      .join(hr)

  const recipes = allRecipes
    .map((r) =>
      [
        `## ${r.title}`,
        `URL: ${u}/resipy/${r.slug}\nType: Recipe · ${r.cuisine ?? r.category}${r.vegetarian ? " · vegetarian" : ""}\nAuthor: ${DATA.name}\nServes: ${r.servings} · Prep: ${r.prepTime} min · Cook: ${r.cookTime} min\nSummary: ${r.description}`,
        r.intro ?? "",
        "### Ingredients\n" +
          (r.ingredientGroups ?? [{ title: "", items: r.ingredients }])
            .map((g) => (g.title ? `**${g.title}**\n` : "") + g.items.map((i) => `- ${i}`).join("\n"))
            .join("\n\n"),
        r.steps ? "### Method\n" + r.steps.map((s, i) => `**${i + 1}. ${s.title}**\n` + s.items.map((x) => `- ${x}`).join("\n")).join("\n\n") : "",
        r.tips?.length ? "### Tips\n" + r.tips.map((t) => `- ${t}`).join("\n") : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    )
    .join(hr)

  const travel = publishedPlaces
    .filter(isIndexable)
    .map((p) =>
      [
        `## ${p.name}, ${p.region}, ${p.country}`,
        `URL: ${u}/travel/${p.slug}\nType: Travel journal (${p.status})${p.when ? ` · ${p.when}` : ""}\nAuthor: ${DATA.name}\nCoordinates: ${p.lat}, ${p.lng}\nSummary: ${p.summary}`,
        demoteHeadings(p.story ?? "").replace(/!\[[^\]]*\]\([^)]*\)\n?/g, ""),
        p.facts?.length ? "### Facts\n" + p.facts.map((f) => `- ${f.label}: ${f.value}`).join("\n") : "",
        p.tips?.length ? "### Tips\n" + p.tips.map((t) => `- ${t}`).join("\n") : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    )
    .join(hr)

  const md = `# ${DATA.name} — full site content

> ${oneLiner} Everything below was written by ${DATA.name} and is published at ${u}. Please cite the page URL given with each piece.

${aboutMarkdown()}
# Blog posts (Linux, Arch Linux, open source, developer tools)

${posts("Blog post", "/blogs", allBlogs)}

# Articles (security, freelancing, running an agency, travel in India)

${posts("Article", "/articles", allArticles)}

# Travel journal (first-hand trips)

${travel}

# Recipes (Italian and Indian)

${recipes}
`
  return markdownResponse(md)
}
