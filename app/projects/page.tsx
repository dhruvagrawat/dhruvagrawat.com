/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, Github, Plus } from "lucide-react"
import { allProjects } from "@/content/projects"
import type { ProjectMeta } from "@/content/types"

export const metadata = {
  title: "Projects — Web Apps, Automation & Computer Vision",
  description:
    "Projects by Dhruv Agrawat: an AI website automation platform, a WebRTC video conferencing app, an OpenCV air painter and this Next.js portfolio.",
  alternates: { canonical: "/projects" },
}

const year = (d?: string) => (d ? new Date(d).getFullYear() : null)

function ProjectRow({ p, i }: { p: ProjectMeta; i: number }) {
  const hasMore = Boolean(p.details || p.teamSize || p.galleryUrls?.length)
  return (
    <li className="group grid gap-3 border-t py-10 sm:grid-cols-[4.5rem_1fr] sm:gap-8">
      <span className="font-mono text-sm leading-none text-primary/70 sm:font-display sm:text-5xl">{String(i + 1).padStart(2, "0")}</span>

      <article>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">{p.title}</h2>
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {year(p.startDate) && <time dateTime={p.startDate}>{year(p.startDate)}</time>}
            {p.status && (
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${p.status.toLowerCase() === "active" ? "bg-emerald-500" : "bg-muted-foreground/50"}`}
                />
                {p.status}
              </span>
            )}
          </p>
        </div>

        {p.coverImage && !p.coverImage.startsWith("/placeholder") && (
          <img
            src={p.coverImage}
            alt={`Screenshot of ${p.title}`}
            loading="lazy"
            decoding="async"
            className="mt-6 aspect-[16/9] w-full rounded-2xl border bg-muted object-cover"
          />
        )}

        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{p.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Built with">
          {p.technologies.map((t) => (
            <li key={t} className="rounded-full border px-3 py-1 font-mono text-[11px] text-muted-foreground">
              {t}
            </li>
          ))}
        </ul>

        {(p.liveUrl || p.githubUrl) && (
          <div className="mt-6 flex flex-wrap gap-5 text-sm font-medium">
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="group/l inline-flex items-center gap-1.5 text-primary">
                Visit site
                <ArrowUpRight className="size-4 transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
              </a>
            )}
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <Github className="size-4" /> Source
              </a>
            )}
          </div>
        )}

        {hasMore && (
          <details className="group/d mt-6 max-w-2xl">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
              <Plus className="size-4 transition-transform group-open/d:rotate-45" /> More about this project
            </summary>
            <div className="mt-4 space-y-4 border-l pl-5 text-[15px] leading-relaxed text-foreground/85">
              {p.details && <p>{p.details}</p>}
              {p.teamSize && (
                <p className="font-mono text-xs text-muted-foreground">
                  Team: {p.teamSize} {p.teamSize === 1 ? "person (solo)" : "people"}
                </p>
              )}
              {p.galleryUrls && p.galleryUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {p.galleryUrls.map((url, j) => (
                    <img key={url} src={url} alt={`${p.title}, screenshot ${j + 1}`} loading="lazy" className="aspect-video w-full rounded-lg border object-cover" />
                  ))}
                </div>
              )}
            </div>
          </details>
        )}
      </article>
    </li>
  )
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
            <ProjectRow key={p.slug} p={p} i={i} />
          ))}
        </ol>
      )}
    </div>
  )
}
