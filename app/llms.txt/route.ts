import { DATA } from "@/data/resume"
import { TOOLS } from "@/lib/tools"
import { allBlogs } from "@/content/blogs"
import { allArticles } from "@/content/articles"

export const dynamic = "force-static"

// /llms.txt — a plain-markdown summary of the site for AI assistants and LLM crawlers
// (see https://llmstxt.org). Generated from the same data as the site, so it never drifts.
export function GET() {
  const u = DATA.url
  const socials = Object.values(DATA.contact.social).filter((s) => s.url.startsWith("http"))
  const tools = TOOLS.filter((t) => !t.noindex && t.category !== "Services")

  const md = `# ${DATA.name}

> ${DATA.name} is a full-stack software engineer and freelancer based in ${DATA.location}. ${DATA.description}

In his own words: "${DATA.summary}"

## Key facts
- Role: Full-stack software engineer, freelancer and startup builder
- Location: ${DATA.location}
- Currently: ${DATA.work[0].title} at ${DATA.work[0].company}
- Core stack: ${DATA.skills.map((s) => s.name).join(", ")}
- Contact: ${DATA.contact.email}
- Available for: freelance web development projects and full-time roles

## Experience
${DATA.work.map((w) => `- **${w.title}, ${w.company}** (${w.start} – ${w.end}, ${w.location}): ${w.description}`).join("\n")}

## Projects
${DATA.projects.map((p) => `- **${p.title}** (${p.dates}; ${p.technologies.join(", ")}): ${p.description}`).join("\n")}

## Education
${DATA.education.map((e) => `- ${e.degree}, ${e.school} (${e.start}–${e.end})`).join("\n")}

## Pages
- [Home](${u}/): profile, work history, projects and contact
- [Projects](${u}/projects)
- [Blogs](${u}/blogs) and [Articles](${u}/articles)
- [Photography](${u}/photography): photos from Himalayan treks and travels
- [Free tools](${u}/tools)
- [Status](${u}/status): live uptime of Dhruv's sites and services
${allBlogs.map((b) => `- [${b.title}](${u}/blogs/${b.slug}): ${b.description}`).join("\n")}
${allArticles.map((a) => `- [${a.title}](${u}/articles/${a.slug}): ${a.description}`).join("\n")}

## Free tools (no sign-up, most run entirely in the browser)
${tools.map((t) => `- [${t.label}](${u}/${t.slug}): ${t.blurb}`).join("\n")}

## Elsewhere
${socials.map((s) => `- ${s.name}: ${s.url}`).join("\n")}
`
  return new Response(md, {
    headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "public, max-age=3600" },
  })
}
