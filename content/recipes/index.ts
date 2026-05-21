import type { RecipeMeta } from "@/content/types"

// ── Import metadata from each recipe ────────────────────────────────────────
// Add a new import + entry here whenever you create a new recipe folder.

import { metadata as butterChicken } from "./butter-chicken"

// ── All recipes metadata (used by the /resipy listing page) ─────────────────
export const allRecipes: RecipeMeta[] = [
  butterChicken,
  // add new recipes here
]

// ── Dynamic import registry (used by /resipy/[slug] detail page) ─────────────
export const recipeRegistry: Record<
  string,
  () => Promise<{ metadata: RecipeMeta; default: React.ComponentType }>
> = {
  "butter-chicken": () => import("./butter-chicken"),
  // add new recipes here (key must match slug)
}
