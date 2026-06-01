import type { MetadataRoute } from "next"
import { DATA } from "@/data/resume"
import { allBlogs } from "@/content/blogs"
import { allArticles } from "@/content/articles"
import { allRecipes } from "@/content/recipes"
import { allMusic } from "@/content/music"
import { allProjects } from "@/content/projects"

const base = DATA.url

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/resipy`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/music`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/photography`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/status`, lastModified: new Date(), changeFrequency: "always", priority: 0.5 },
    { url: `${base}/weather`, lastModified: new Date(), changeFrequency: "never", priority: 0.4 },
    { url: `${base}/currency`, lastModified: new Date(), changeFrequency: "never", priority: 0.4 },
    { url: `${base}/time`, lastModified: new Date(), changeFrequency: "never", priority: 0.4 },
    { url: `${base}/qr`, lastModified: new Date(), changeFrequency: "never", priority: 0.4 },
    { url: `${base}/password`, lastModified: new Date(), changeFrequency: "never", priority: 0.4 },
    { url: `${base}/ip`, lastModified: new Date(), changeFrequency: "never", priority: 0.4 },
  ]

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

  return [...staticPages, ...blogPages, ...articlePages, ...recipePages, ...musicPages]
}
