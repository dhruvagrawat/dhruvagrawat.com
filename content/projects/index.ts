import type { ComponentType } from "react"
import type { ProjectMeta } from "@/content/types"

/* ── How to add or edit a project ─────────────────────────────────────────────
   This list is the ONLY place projects live: the home page, /projects,
   /projects/<slug>, the About page, the 1999 page and llms.txt all read it.

   1. Add an entry below. Only slug, title, description and technologies are
      required; every other field (see ProjectMeta in content/types.ts) is optional
      and simply doesn't show when empty.
   2. `featured: true` puts it on the home page (in list order).
   3. Screenshots: put them in public/projects/<slug>/ and set coverImage / galleryUrls.
   4. Want a fully custom page section (a demo, a chart, anything React)?
      Create content/projects/<slug>.tsx with a default export and register it in
      `projectExtras` below. It renders under the write-up on /projects/<slug>.
   ──────────────────────────────────────────────────────────────────────────── */
export const allProjects: ProjectMeta[] = [
  {
    slug: "ai-website-automation-tool",
    title: "AI Website Automation Tool",
    featured: true,
    year: "2024",
    startDate: "2024-01-01",
    status: "Active",
    description:
      "An AI-powered platform that generates and deploys websites end to end, built on a modern full-stack setup.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Docker", "AI APIs"],
  },
  {
    slug: "video-conferencing-platform",
    title: "Video Conferencing Platform",
    featured: true,
    year: "2023",
    startDate: "2023-01-01",
    status: "Completed",
    description: "A real-time video conferencing system built on WebRTC, with in-call chat and audio-video sync.",
    technologies: ["WebRTC", "Node.js", "JavaScript"],
  },
  {
    slug: "opencv-air-painter",
    title: "OpenCV Air Painter",
    featured: true,
    year: "2023",
    startDate: "2023-01-01",
    status: "Completed",
    description:
      "A gesture-based drawing app: draw in the air with your finger in front of a webcam. Built with OpenCV and Python and optimised for low-end hardware.",
    technologies: ["Python", "OpenCV"],
  },
  {
    slug: "dhruvagrawat-com",
    title: "dhruvagrawat.com",
    year: "2024 – now",
    startDate: "2024-01-01",
    status: "Active",
    role: "Design & development",
    teamSize: 1,
    description:
      "This site: portfolio, writing, a 3D travel globe, trek photography and 30+ free browser tools, built with Next.js and static content files.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://dhruvagrawat.com",
    githubUrl: "https://github.com/dhruvagrawat/dhruvagrawat.com",
    highlights: [
      "Almost every page is pre-rendered static HTML, so it loads fast and costs next to nothing to host",
      "Photos are converted to small WebP copies ahead of time instead of paying for image optimisation",
      "Content lives in version-controlled TypeScript files, not a database",
    ],
    details: `A fully static portfolio with sections for blogs, articles, recipes, music, photography, travel and projects.

## How it's built

- **Next.js 15 App Router** with React Server Components, so most pages ship little or no JavaScript
- **Tailwind CSS 4** and Framer Motion for the "summit" look and the parallax hero
- Content in TypeScript files next to the code: fast, reviewable and deployable anywhere
- A small Supabase database only for the live status page`,
  },
  // add more projects here
]

/** Optional custom React sections, keyed by slug (see step 4 above). */
export const projectExtras: Record<string, () => Promise<{ default: ComponentType }>> = {
  // "my-project": () => import("./my-project"),
}

export const featuredProjects = allProjects.filter((p) => p.featured)

/** "2024", "2023 – now"… */
export const projectYear = (p: ProjectMeta) => p.year ?? (p.startDate ? String(new Date(p.startDate).getFullYear()) : "")

export function getProjectBySlug(slug: string): ProjectMeta | undefined {
  return allProjects.find((p) => p.slug === slug)
}
