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
