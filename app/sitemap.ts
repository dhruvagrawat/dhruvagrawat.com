import type { MetadataRoute } from "next"
import { DATA } from "@/data/resume"
import { allBlogs } from "@/content/blogs"
import { allArticles } from "@/content/articles"
import { allRecipes } from "@/content/recipes"
import { allMusic } from "@/content/music"
import { TOOLS } from "@/lib/tools"
import { isIndexable, publishedPlaces } from "@/content/travel/places"

const base = DATA.url

/**
 * Real "last changed" dates. Search engines trust <lastmod> only when it is accurate,
 * so pages don't claim to change on every deploy — bump SITE_UPDATED when you edit
 * the home page, projects, photography or tools.
 */
const SITE_UPDATED = "2026-09-29"

const latest = (...dates: (string | undefined)[]) =>
  new Date(Math.max(...dates.filter(Boolean).map((d) => new Date(d as string).getTime())))

export default function sitemap(): MetadataRoute.Sitemap {
  const blogsUpdated = latest(...allBlogs.map((b) => b.updated ?? b.date))
  const articlesUpdated = latest(...allArticles.map((a) => a.updated ?? a.date))
  const recipesUpdated = latest(...allRecipes.map((r) => r.date))
  const travelUpdated = latest(...publishedPlaces.map((p) => p.updated))
  const siteUpdated = latest(SITE_UPDATED, blogsUpdated.toISOString(), articlesUpdated.toISOString(), recipesUpdated.toISOString(), travelUpdated.toISOString())

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: siteUpdated, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blogs`, lastModified: blogsUpdated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/articles`, lastModified: articlesUpdated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/resipy`, lastModified: recipesUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/photography`, lastModified: new Date(SITE_UPDATED), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/travel`, lastModified: travelUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/projects`, lastModified: new Date(SITE_UPDATED), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools`, lastModified: new Date(SITE_UPDATED), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date("2026-09-29"), changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/1999`, lastModified: new Date(SITE_UPDATED), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/status`, lastModified: new Date(SITE_UPDATED), changeFrequency: "always", priority: 0.5 },
  ]

  // every indexable tool from the registry (payments is noindex)
  const toolPages: MetadataRoute.Sitemap = TOOLS.filter((t) => !t.noindex && t.slug !== "status").map((t) => ({
    url: `${base}/${t.slug}`,
    lastModified: new Date(SITE_UPDATED),
    changeFrequency: "monthly",
    priority: t.category === "Developer" || t.category === "Utilities" ? 0.7 : 0.6,
  }))

  const travelPages: MetadataRoute.Sitemap = publishedPlaces
    .filter(isIndexable)
    .map((p) => ({ url: `${base}/travel/${p.slug}`, lastModified: new Date(p.updated), changeFrequency: "monthly", priority: 0.7 }))

  const blogPages: MetadataRoute.Sitemap = allBlogs.map((b) => ({
    url: `${base}/blogs/${b.slug}`,
    lastModified: new Date(b.updated ?? b.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const articlePages: MetadataRoute.Sitemap = allArticles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const recipePages: MetadataRoute.Sitemap = allRecipes.map((r) => ({
    url: `${base}/resipy/${r.slug}`,
    lastModified: new Date(r.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const musicPages: MetadataRoute.Sitemap = allMusic.map((m) => ({
    url: `${base}/music/${m.slug}`,
    lastModified: new Date(m.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  // music pages are placeholders for now (noindex), so they stay out of the sitemap
  void musicPages
  return [...staticPages, ...toolPages, ...travelPages, ...blogPages, ...articlePages, ...recipePages]
}
