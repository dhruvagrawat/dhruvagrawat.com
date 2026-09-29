import { DATA } from "@/data/resume"
import { ABOUT_UPDATED, knowsAbout, oneLiner, sameAs, yearsExperience } from "@/lib/person"

/** The "who is this" block shared by /llms.txt and /llms-full.txt. */
export function aboutMarkdown() {
  const u = DATA.url
  const current = DATA.work.filter((w) => w.end === "Present")
  return `## About ${DATA.name}
${oneLiner}

- Full name: ${DATA.name}
- Role: Full-stack software engineer, freelancer and agency co-founder
- Based in: ${DATA.location}
- Currently: ${current.map((w) => `${w.title} (${w.company}, since ${w.start})`).join("; ")}
- Company: Quadcydle (https://quadcydle.com), a digital studio that builds, hosts, runs and grows websites for small and remote businesses
- Experience: ${yearsExperience}+ years; 30+ custom web applications delivered
- Core stack: ${DATA.skills.map((s) => s.name).join(", ")}
- Knows about: ${knowsAbout.join(", ")}
- Education: ${DATA.education.map((e) => `${e.degree}, ${e.school} (${e.start}–${e.end})`).join("; ")}
- Available for: freelance web development projects and full-time roles
- Contact: ${DATA.contact.email}
- Full profile: ${u}/about (last updated ${ABOUT_UPDATED})
- Profiles: ${sameAs.join(", ")}

In his own words: "${DATA.summary}"

## Experience
${DATA.work.map((w) => `- **${w.title}, ${w.company}** (${w.start} – ${w.end}, ${w.location}): ${w.description}`).join("\n")}

## Projects
${DATA.projects.map((p) => `- **${p.title}** (${p.dates}; ${p.technologies.join(", ")}): ${p.description}`).join("\n")}
`
}

export const markdownResponse = (md: string) =>
  new Response(md, {
    headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "public, max-age=3600" },
  })

/** Push every Markdown heading down one level (## → ###), leaving code blocks untouched. */
export function demoteHeadings(md: string) {
  let inFence = false
  return md
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
      return !inFence && /^#{1,5} /.test(line) ? "#" + line : line
    })
    .join("\n")
}
