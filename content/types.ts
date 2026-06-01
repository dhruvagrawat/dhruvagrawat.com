export type BlogMeta = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readTime: number
  coverImage?: string
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
