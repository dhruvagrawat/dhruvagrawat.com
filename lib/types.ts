export interface Recipe {
  id: string
  title: string
  slug: string
  description: string
  image_url: string
  tags: string[]
  category: string
  cook_time: number
  servings: number
  ingredients: string[]
  directions: string[]
  created_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  description: string
  image_url: string
  content: string
  author: string
  tags: string[]
  read_time: number
  created_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  description: string
  image_url: string
  content: string
  author: string
  tags: string[]
  read_time: number
  created_at: string
}

export interface MusicItem {
  id: string
  title: string
  slug: string
  image_url: string
  tags: string[]
  audio_url?: string
  artist?: string
  album?: string
  duration?: number
  created_at: string
}
