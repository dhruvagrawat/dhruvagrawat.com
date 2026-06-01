import { allProjects } from "@/content/projects"
import { ProjectsGridClient } from "@/components/project/projects-grid-client"

export const metadata = {
  title: "Projects | Dhruv Agrawat",
  description: "Things I've built — side projects, freelance work, and startup experiments.",
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-3">Projects</h1>
        <p className="text-muted-foreground mb-12">
          Things I&apos;ve built — side projects, freelance work, and startup experiments.
        </p>

        {allProjects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet — check back soon.</p>
        ) : (
          <ProjectsGridClient projects={allProjects} />
        )}
      </div>
    </div>
  )
}
