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
  {
    slug: "ai-website-automation-tool",
    title: "AI Website Automation Tool",
    description:
      "An AI-powered automation platform that generates and deploys websites using modern full-stack technologies.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Docker", "AI APIs"],
    status: "Active",
    startDate: "2024-01-01",
  },
  {
    slug: "video-conferencing-platform",
    title: "Video Conferencing Platform",
    description:
      "A real-time video conferencing system built on WebRTC, with in-call chat and audio-video sync.",
    technologies: ["WebRTC", "Node.js", "JavaScript"],
    status: "Completed",
    startDate: "2023-01-01",
  },
  {
    slug: "opencv-air-painter",
    title: "OpenCV Air Painter",
    description:
      "A gesture-based virtual drawing app: draw in the air with your finger in front of a webcam. Built with OpenCV and Python and optimised for low-end hardware.",
    technologies: ["Python", "OpenCV"],
    status: "Completed",
    startDate: "2023-01-01",
  },
  // add more projects here
]

export function getProjectBySlug(slug: string): ProjectMeta | undefined {
  return allProjects.find((p) => p.slug === slug)
}
