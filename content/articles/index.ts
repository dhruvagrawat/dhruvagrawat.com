import type { ArticleMeta } from "@/content/types"

// ── Import metadata from each article ───────────────────────────────────────
// Add a new import + entry here whenever you create a new article folder.

import { metadata as buildingScalableApis } from "./building-scalable-apis"

// ── All articles metadata (used by the /articles listing page) ───────────────
export const allArticles: ArticleMeta[] = [
  buildingScalableApis,
  // add new articles here
]

// ── Dynamic import registry (used by /articles/[slug] detail page) ───────────
export const articleRegistry: Record<
  string,
  () => Promise<{ metadata: ArticleMeta; default: React.ComponentType }>
> = {
  "building-scalable-apis": () => import("./building-scalable-apis"),
  // add new articles here (key must match slug)
}
