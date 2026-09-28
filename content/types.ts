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
  coverImage?: string
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
  slug: string
  title: string
  description: string
  details?: string
  coverImage?: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  status?: string
  startDate?: string
  teamSize?: number
  galleryUrls?: string[]
}
