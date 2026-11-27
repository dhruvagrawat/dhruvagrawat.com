import type { ProjectMeta } from "@/content/types"
import { projectYear } from "@/content/projects"

/** Accent colour for a project, as a CSS variable (falls back to the site's primary colour). */
export const accentStyle = (p: ProjectMeta) =>
  ({ "--accent-project": p.accent ?? "var(--primary)" }) as React.CSSProperties

export function ProjectMetaLine({ p }: { p: ProjectMeta }) {
  const year = projectYear(p)
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      {year && <span>{year}</span>}
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
  )
}

export function TechList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Built with">
      {items.map((t) => (
        <li key={t} className="rounded-full border px-3 py-1 font-mono text-[11px] text-muted-foreground">
          {t}
        </li>
      ))}
    </ul>
  )
}

/** All outbound links for a project, in one list: live site, source, then any extras. */
export function projectLinks(p: ProjectMeta) {
  return [
    ...(p.liveUrl ? [{ label: "Visit site", href: p.liveUrl }] : []),
    ...(p.githubUrl ? [{ label: "Source code", href: p.githubUrl }] : []),
    ...(p.links ?? []),
  ]
}
