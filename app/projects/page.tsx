/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { allProjects } from "@/content/projects"
import { ProjectMetaLine, TechList, accentStyle } from "@/components/project/project-ui"

export const metadata = {
  title: "Projects — Web Apps, Automation & Computer Vision",
  description:
    "Projects by Dhruv Agrawat: an AI website automation platform, a WebRTC video conferencing app, an OpenCV air painter and this Next.js portfolio.",
  alternates: { canonical: "/projects" },
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-1 pt-4 sm:px-4">
      <header className="mb-14">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Projects</p>
        <h1 className="text-5xl leading-[0.95] sm:text-7xl">
          Things I&apos;ve <span className="italic">built.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Side projects, freelance work and startup experiments — what each one does, what it&apos;s built with, and where
          to see it.
        </p>
      </header>

      {allProjects.length === 0 ? (
        <p className="text-muted-foreground">No projects yet — check back soon.</p>
      ) : (
        <ol className="border-b">
          {allProjects.map((p, i) => (
            <li key={p.slug} style={accentStyle(p)}>
              <Link
                href={`/projects/${p.slug}`}
                className="group grid gap-3 border-t py-10 sm:grid-cols-[4.5rem_1fr] sm:gap-8"
              >
                <span className="font-mono text-sm leading-none text-[var(--accent-project)] opacity-70 sm:font-display sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="flex items-center gap-2 font-display text-3xl leading-tight transition-colors group-hover:text-[var(--accent-project)] sm:text-4xl">
                      {p.title}
                      <ArrowUpRight className="size-6 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </h2>
                    <ProjectMetaLine p={p} />
                  </div>
                  {p.coverImage && (
                    <img
                      src={p.coverImage}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="mt-6 aspect-[16/9] w-full rounded-2xl border bg-muted object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  )}
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{p.description}</p>
                  <div className="mt-5">
                    <TechList items={p.technologies} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
