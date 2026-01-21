-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  tags TEXT[], -- Array of tags like ['Indian', 'Vegan']
  ingredients JSONB, -- Array of ingredient objects
  directions JSONB, -- Array of direction step objects
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  thumbnail TEXT,
  description TEXT,
  content TEXT, -- Full blog content
  tags TEXT[],
  author TEXT,
  read_time INTEGER, -- in minutes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  thumbnail TEXT,
  description TEXT,
  content TEXT, -- Full article content
  tags TEXT[],
  author TEXT,
  read_time INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create music table
CREATE TABLE IF NOT EXISTS music (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  cover_image TEXT,
  audio_url TEXT, -- URL to streaming audio file
  tags TEXT[], -- like ['lofi', 'chill', 'synthwave']
  duration INTEGER, -- in seconds
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS recipes_slug_idx ON recipes(slug);
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs(slug);
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS music_slug_idx ON music(slug);

-- Optionally enable RLS (Row Level Security) if needed for future auth
-- ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE music ENABLE ROW LEVEL SECURITY;
