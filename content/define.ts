import type { ArticleMeta, BlogMeta, RecipeMeta } from "./types"

/* Helpers for writing posts as plain data + Markdown.
   Reading time is worked out from the text (≈200 words a minute, code counts double). */

function minutes(body: string) {
  const count = (t: string) => t.split(/\s+/).filter(Boolean).length
  const code = (body.match(/```[\s\S]*?```/g) ?? []).join(" ")
  const prose = body.replace(/```[\s\S]*?```/g, " ")
  // ~200 words a minute for prose; code is read more slowly, so it counts at half speed
  return Math.max(3, Math.round((count(prose) + count(code) * 2) / 200))
}

export function defineBlog(p: Omit<BlogMeta, "readTime"> & { body: string; readTime?: number }): BlogMeta {
  return { ...p, readTime: p.readTime ?? minutes(p.body) }
}

export function defineArticle(p: Omit<ArticleMeta, "readTime"> & { body: string; readTime?: number }): ArticleMeta {
  return { ...p, readTime: p.readTime ?? minutes(p.body) }
}

export function defineRecipe(
  p: Omit<RecipeMeta, "ingredients"> & { ingredientGroups: { title: string; items: string[] }[] }
): RecipeMeta {
  return { ...p, ingredients: p.ingredientGroups.flatMap((g) => g.items) }
}
