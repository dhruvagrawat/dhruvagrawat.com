import type { BlogMeta } from "@/content/types"
import { mdModule } from "@/components/writing/md-module"
import { metadata as gettingStartedWithNextjs } from "./getting-started-with-nextjs"
import { posts } from "./posts"

/* ── How to add a blog post ────────────────────────────────────────────────
   1. Copy any file in ./posts, rename it (the file name doesn't matter, `slug` does)
   2. Edit the fields and write the body in Markdown
   3. Add it to the list in ./posts/index.ts
   ─────────────────────────────────────────────────────────────────────────── */

export const allBlogs: BlogMeta[] = [...posts, gettingStartedWithNextjs].sort(
  (a, b) => +new Date(b.date) - +new Date(a.date)
)

export const blogRegistry: Record<
  string,
  () => Promise<{ metadata: BlogMeta; default: React.ComponentType }>
> = {
  "getting-started-with-nextjs": () => import("./getting-started-with-nextjs"),
  ...Object.fromEntries(posts.map((p) => [p.slug, () => Promise.resolve(mdModule(p))])),
}
