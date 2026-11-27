export type BlogMeta = {
  slug: string
  title: string
  description: string
  date: string
  /** last meaningful update, ISO date */
  updated?: string
  tags: string[]
  readTime: number
  coverImage?: string
  /** short label shown above the title, e.g. "Arch Linux" */
  category?: string
  /** Markdown body — used for the table of contents and word count */
  body?: string
}

export type ArticleMeta = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readTime: number
  coverImage?: string
  publication?: string
  updated?: string
  category?: string
  body?: string
}

export type RecipeMeta = {
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  prepTime: number
  cookTime: number
  servings: number
  /** photo: /recipe-photos/<slug>.webp (made by scripts/recipe-photo.py), 4:3 works best */
  coverImage?: string
  /** required when the photo isn't yours (e.g. Creative Commons): shown under the photo */
  coverCredit?: { author: string; license: string; url: string }
  ingredients: string[]
  /** e.g. "Italian", "North Indian" — used for search results */
  cuisine?: string
  difficulty?: "Easy" | "Medium" | "Involved"
  vegetarian?: boolean
  /** short story/intro shown above the recipe (Markdown) */
  intro?: string
  /** ingredient groups; when present they replace the flat `ingredients` list on the page */
  ingredientGroups?: { title: string; items: string[] }[]
  /** method, grouped into stages */
  steps?: { title: string; items: string[] }[]
  tips?: string[]
  /** extra search keywords */
  keywords?: string[]
}

export type MusicMeta = {
  slug: string
  title: string
  artist?: string
  album?: string
  tags: string[]
  duration?: number
  coverImage?: string
  audioUrl?: string
  date: string
}

export type ProjectMeta = {
  /** URL: /projects/<slug> */
  slug: string
  title: string
  /** one or two sentences, shown on cards and in search results */
  description: string
  technologies: string[]

  /** show on the home page (in list order) */
  featured?: boolean
  /** e.g. "2024" or "2023 – now"; falls back to the year of startDate */
  year?: string
  startDate?: string
  /** "Active", "Completed", "Archived"… Active gets a green dot */
  status?: string
  /** your part, e.g. "Co-founder & lead engineer" */
  role?: string
  /** who it was for, e.g. "Freelance · Acme Corp" */
  client?: string
  teamSize?: number

  liveUrl?: string
  githubUrl?: string
  /** any other buttons: case study, App Store, demo video… */
  links?: { label: string; href: string }[]

  /** screenshot, e.g. /projects/<slug>/cover.webp (16:9 works best) */
  coverImage?: string
  galleryUrls?: string[]
  /** CSS colour for this project's accent, e.g. "#7c3aed" or "oklch(0.6 0.2 300)" */
  accent?: string

  /** short bullet results: "Cut deploy time from 20 min to 2" */
  highlights?: string[]
  /** long write-up for the project page (Markdown: ## headings, lists, images, links) */
  details?: string
}
