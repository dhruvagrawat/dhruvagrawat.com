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

export interface PhotoItem {
  id: string
  title: string
  description: string
  image_url: string
  location: string
  tags: string[]
  camera?: string
  lens?: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  image_url: string
  details?: string
  technologies: string[]
  gallery_urls?: string[]
  github_url?: string
  live_url?: string
  status?: string
  start_date?: string
  end_date?: string
  team_size?: number
  created_at: string
}
