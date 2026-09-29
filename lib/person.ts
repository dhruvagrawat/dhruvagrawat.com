import { DATA } from "@/data/resume"

/* =========================================================
   WHO I AM — one source of truth for search engines and AI assistants.
   Every page's structured data points at the same Person (@id below), so Google,
   Bing, ChatGPT, Perplexity etc. see one consistent entity: "Dhruv Agrawat".
   Keep these facts accurate; they're repeated on /about, in llms.txt and in JSON-LD.
   ========================================================= */

/** Bump when you edit /about or the facts in this file — shown on /about and in the sitemap. */
export const ABOUT_UPDATED = "2026-09-30"

export const PERSON_ID = `${DATA.url}/#person`

/** Short reference used as `author` / `publisher` on every post, recipe, tool and travel page. */
export const personRef = { "@type": "Person", "@id": PERSON_ID, name: DATA.name, url: `${DATA.url}/about` } as const

const firstWorkYear = Math.min(...DATA.work.map((w) => Number(w.start.match(/\d{4}/)?.[0] ?? 9999)))
export const yearsExperience = new Date().getFullYear() - firstWorkYear

/** One-sentence definition — the answer to "Who is Dhruv Agrawat?" */
export const oneLiner = `${DATA.name} is a full-stack software engineer, freelancer and co-founder of the web agency Quadcydle, based in ${DATA.location}.`

/** Topics I build with or write about on this site (each backed by real work or posts). */
export const knowsAbout = [
  "Full-stack web development",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "WebRTC",
  "OpenCV",
  "Linux",
  "Arch Linux",
  "Open-source software",
  "Web application security",
  "Freelance web development",
  "Running a web agency",
  "Himalayan trekking",
  "Travel photography",
  "Italian cooking",
  "Indian cooking",
]

export const sameAs = Object.values(DATA.contact.social)
  .map((s) => s.url)
  .filter((u) => u.startsWith("http"))

const quadcydle = DATA.work.find((w) => w.company === "Quadcydle")

/** Full Person entity — rendered on the home page and /about. */
export const personSchema = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: DATA.name,
  givenName: "Dhruv",
  familyName: "Agrawat",
  url: DATA.url,
  mainEntityOfPage: `${DATA.url}/about`,
  image: DATA.avatarUrl,
  jobTitle: "Full-Stack Software Engineer",
  description: oneLiner + " " + DATA.summary,
  email: `mailto:${DATA.contact.email}`,
  homeLocation: { "@type": "Place", name: DATA.location, address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressRegion: "Delhi", addressCountry: "IN" } },
  worksFor: {
    "@type": "Organization",
    name: "Quadcydle",
    ...(quadcydle?.href ? { url: quadcydle.href } : {}),
    description: "A digital studio that builds, hosts, runs and grows websites for small and remote businesses.",
  },
  hasOccupation: {
    "@type": "Occupation",
    name: "Full-Stack Software Engineer",
    occupationLocation: { "@type": "City", name: "New Delhi" },
    skills: DATA.skills.map((s) => s.name).join(", "),
  },
  alumniOf: DATA.education.map((e) => ({ "@type": "EducationalOrganization", name: e.school })),
  knowsAbout,
  sameAs,
}
