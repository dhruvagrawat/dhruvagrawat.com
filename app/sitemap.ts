import type { MetadataRoute } from "next"
import { DATA } from "@/data/resume"
import { allBlogs } from "@/content/blogs"
import { allArticles } from "@/content/articles"
import { allRecipes } from "@/content/recipes"
import { allMusic } from "@/content/music"
import { TOOLS } from "@/lib/tools"
import { publishedPlaces } from "@/content/travel/places"

const base = DATA.url

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/resipy`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/music`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/photography`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/travel`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/1999`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/status`, lastModified: new Date(), changeFrequency: "always", priority: 0.5 },
  ]

  // every indexable tool from the registry (payments is noindex)
  const toolPages: MetadataRoute.Sitemap = TOOLS.filter((t) => !t.noindex && t.slug !== "status").map((t) => ({
    url: `${base}/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: t.category === "Developer" || t.category === "Utilities" ? 0.7 : 0.6,
  }))

  const travelPages: MetadataRoute.Sitemap = publishedPlaces
    .filter((p) => !p.draft)
    .map((p) => ({ url: `${base}/travel/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 }))

  const blogPages: MetadataRoute.Sitemap = allBlogs.map((b) => ({
    url: `${base}/blogs/${b.slug}`,
    lastModified: new Date(b.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const articlePages: MetadataRoute.Sitemap = allArticles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: new Date(a.date),
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

  return [...staticPages, ...toolPages, ...travelPages, ...blogPages, ...articlePages, ...recipePages, ...musicPages]
}
