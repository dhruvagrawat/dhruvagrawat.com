'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RecipeAdmin } from './recipe-admin'
import { BlogAdmin } from './blog-admin'
import { ArticleAdmin } from './article-admin'
import { MusicAdmin } from './music-admin'

export function EnhancedAdminDashboard() {
  const [activeTab, setActiveTab] = useState('recipes')

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Content Management Dashboard</h1>
        <p className="text-zinc-400">Manage all your content in one place. Add, edit, and delete recipes, blogs, articles, and music.</p>
      </div>

      <Tabs defaultValue="recipes" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8 bg-zinc-800 border border-zinc-700 rounded-lg p-1 h-auto">
          <TabsTrigger 
            value="recipes" 
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500"
          >
            <span className="text-lg">🍳</span>
            <span className="ml-2 font-semibold">Recipes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="blogs"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500"
          >
            <span className="text-lg">📝</span>
            <span className="ml-2 font-semibold">Blogs</span>
          </TabsTrigger>
          <TabsTrigger 
            value="articles"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500"
          >
            <span className="text-lg">📰</span>
            <span className="ml-2 font-semibold">Articles</span>
          </TabsTrigger>
          <TabsTrigger 
            value="music"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500"
          >
            <span className="text-lg">🎵</span>
            <span className="ml-2 font-semibold">Music</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <RecipeAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blogs">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <BlogAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <ArticleAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="music">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <MusicAdmin />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
