# Setup Guide - Personal Portfolio CMS

## Quick Start

### 1. Seed the Database with Dummy Data

Visit the seed page to populate your Supabase database with 3 dummy entries for each content type:

**URL:** `http://localhost:3000/seed`

Click the "Seed Database" button to add:
- 3 Recipes (Paneer Butter Masala, Spaghetti Carbonara, Chocolate Lava Cake)
- 3 Blogs (Mindful Cooking, Digital Wellness, Travel Stories)
- 3 Articles (AI in Healthcare, Quantum Computing, Web3 Future)
- 3 Music Tracks (Midnight Serenity, Neon Dreams, Ambient Bliss)

All entries include:
- Professional images (auto-generated)
- Complete metadata
- Tags and categories
- Full content

### 2. Access the Admin Dashboard

**URL:** `http://localhost:3000/godmod`

**Password:** `dhruvagrawat.com`

The admin dashboard features:
- Tabbed interface for each content type
- View all existing entries
- Edit existing entries
- Delete entries
- Add new entries with full form support
- Real-time Supabase sync

### 3. View Your Content

- **Recipes:** `/resipy` - Featured carousel + filtered grid
- **Blogs:** `/blogs` - Blog card grid with details
- **Articles:** `/articles` - Article card grid with details
- **Music:** `/music` - Spotify-style music player

## Admin Dashboard Features

### Recipe Management
- Add recipes with title, description, category, tags
- Set cooking time and servings
- Add ingredients list and directions
- Upload cover image URL
- Edit and delete existing recipes

### Blog Management
- Create blog posts with markdown content
- Set author, read time, tags
- Upload thumbnail image
- Edit and delete blog posts

### Article Management
- Create detailed articles
- Set author, read time, tags
- Upload feature image
- Edit and delete articles

### Music Management
- Add music tracks with metadata
- Upload cover art
- Provide audio file URL (streaming)
- Set duration, artist, album
- Edit and delete tracks

## Database Schema

### Recipes Table
\`\`\`
id: UUID (Primary Key)
title: Text
slug: Text (Unique)
description: Text
image_url: Text
category: Text
tags: Array
cook_time: Integer (minutes)
servings: Integer
ingredients: JSONB (Array)
directions: JSONB (Array)
created_at: Timestamp
\`\`\`

### Blogs Table
\`\`\`
id: UUID (Primary Key)
title: Text
slug: Text (Unique)
description: Text
image_url: Text
content: Text (Markdown)
author: Text
tags: Array
read_time: Integer (minutes)
created_at: Timestamp
\`\`\`

### Articles Table
\`\`\`
id: UUID (Primary Key)
title: Text
slug: Text (Unique)
description: Text
image_url: Text
content: Text (Markdown)
author: Text
tags: Array
read_time: Integer (minutes)
created_at: Timestamp
\`\`\`

### Music Table
\`\`\`
id: UUID (Primary Key)
title: Text
slug: Text (Unique)
image_url: Text
tags: Array
artist: Text
audio_url: Text
album: Text
duration: Integer (seconds)
created_at: Timestamp
\`\`\`

## API Endpoints

All endpoints are protected and use Supabase authentication:

- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe

- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog

- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create article
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article

- `GET /api/music` - Get all music
- `POST /api/music` - Create music
- `PUT /api/music/[id]` - Update music
- `DELETE /api/music/[id]` - Delete music

## Troubleshooting

### Database Not Seeding
1. Ensure Supabase connection is active
2. Check that environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Visit `/seed` page and click button again

### Data Not Appearing on Pages
1. Check browser console for errors
2. Verify Supabase API routes are accessible
3. Ensure tables exist in Supabase
4. Try refreshing the page

### Admin Dashboard Not Loading
1. Verify password is: `dhruvagrawat.com`
2. Check browser console for errors
3. Ensure all admin components are properly imported

## Next Steps

1. Customize the admin dashboard theme in `/components/admin/`
2. Add additional pages or content types as needed
3. Implement user authentication (optional)
4. Add image upload functionality (currently uses URLs)
5. Deploy to Vercel with Supabase integration

## File Structure

\`\`\`
/app
  /api
    /recipes/[id]/route.ts
    /recipes/route.ts
    /blogs/[id]/route.ts
    /blogs/route.ts
    /articles/[id]/route.ts
    /articles/route.ts
    /music/[id]/route.ts
    /music/route.ts
    /seed/route.ts
  /godmod/page.tsx (Admin Dashboard)
  /resipy/page.tsx (Recipes)
  /blogs/page.tsx (Blogs)
  /articles/page.tsx (Articles)
  /music/page.tsx (Music)
  /seed/page.tsx (Database Seeding)

/components/admin
  /enhanced-admin-dashboard.tsx
  /password-gate.tsx
  /recipe-admin.tsx
  /blog-admin.tsx
  /article-admin.tsx
  /music-admin.tsx

/public/images
  (Generated images for all content)
\`\`\`
