import type { ProjectMeta } from "@/content/types"

// ── Add each project here ─────────────────────────────────────────────────
export const allProjects: ProjectMeta[] = [
  {
    slug: "dhruvagrawat-com",
    title: "dhruvagrawat.com",
    description:
      "Personal portfolio and digital home — built with Next.js 15 App Router, Tailwind CSS, and static content files.",
    details:
      "A fully static portfolio site with sections for blogs, articles, recipes, music, photography, and projects. Content lives in TSX files co-located with the source rather than a database, making it fast, version-controlled, and deployable anywhere.",
    coverImage: "/placeholder.svg?height=500&width=1000&text=Portfolio",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    githubUrl: "https://github.com/dhruvagrawat/dhruvagrawat.com",
    liveUrl: "https://dhruvagrawat.com",
    status: "Active",
    startDate: "2024-01-01",
    teamSize: 1,
  },
  // add more projects here
]

export function getProjectBySlug(slug: string): ProjectMeta | undefined {
  return allProjects.find((p) => p.slug === slug)
}
