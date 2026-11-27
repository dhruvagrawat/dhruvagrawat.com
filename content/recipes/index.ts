import type { RecipeMeta } from "@/content/types"
import { metadata as butterChicken } from "./butter-chicken"
import { recipes } from "./posts"

/* ── How to add a recipe ───────────────────────────────────────────────────
   1. Copy any file in ./posts and edit it — ingredients and steps are plain lists
   2. Add it to the list in ./posts/index.ts
   3. Photos: python3 scripts/recipe-photo.py <photo> <slug>, then set `coverImage` (and `coverCredit` if it isn't yours)
   ─────────────────────────────────────────────────────────────────────────── */

export const allRecipes: RecipeMeta[] = [...recipes, butterChicken].sort(
  (a, b) => +new Date(b.date) - +new Date(a.date)
)

function structured(meta: RecipeMeta) {
  return { metadata: meta, default: () => null }
}

export const recipeRegistry: Record<
  string,
  () => Promise<{ metadata: RecipeMeta; default: React.ComponentType }>
> = {
  "butter-chicken": () => import("./butter-chicken"),
  ...Object.fromEntries(recipes.map((r) => [r.slug, () => Promise.resolve(structured(r))])),
}
