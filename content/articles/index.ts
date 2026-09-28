import type { ArticleMeta } from "@/content/types"
import { mdModule } from "@/components/writing/md-module"
import { metadata as buildingScalableApis } from "./building-scalable-apis"
import { posts } from "./posts"

/* ── How to add an article ─────────────────────────────────────────────────
   1. Copy any file in ./posts and edit it (Markdown body)
   2. Add it to the list in ./posts/index.ts
   ─────────────────────────────────────────────────────────────────────────── */

export const allArticles: ArticleMeta[] = [...posts, buildingScalableApis].sort(
  (a, b) => +new Date(b.date) - +new Date(a.date)
)

export const articleRegistry: Record<
  string,
  () => Promise<{ metadata: ArticleMeta; default: React.ComponentType }>
> = {
  "building-scalable-apis": () => import("./building-scalable-apis"),
  ...Object.fromEntries(posts.map((p) => [p.slug, () => Promise.resolve(mdModule(p))])),
}
