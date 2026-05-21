import type { BlogMeta } from "@/content/types"

// ── Import metadata from each blog ──────────────────────────────────────────
// Add a new import + entry here whenever you create a new blog folder.

import { metadata as gettingStartedWithNextjs } from "./getting-started-with-nextjs"

// ── All blogs metadata (used by the /blogs listing page) ────────────────────
export const allBlogs: BlogMeta[] = [
  gettingStartedWithNextjs,
  // add new blogs here
]

// ── Dynamic import registry (used by /blogs/[slug] detail page) ─────────────
export const blogRegistry: Record<
  string,
  () => Promise<{ metadata: BlogMeta; default: React.ComponentType }>
> = {
  "getting-started-with-nextjs": () => import("./getting-started-with-nextjs"),
  // add new blogs here (key must match slug)
}
