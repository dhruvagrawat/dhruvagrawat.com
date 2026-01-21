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
        <p className="text-zinc-400">Manage all your content in one place. Add, edit, and delete recipes, blogs, articles, music, photography, and projects.</p>
      </div>

      <Tabs defaultValue="recipes" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-8 bg-zinc-800 border border-zinc-700 rounded-lg p-1 h-auto gap-1">
          <TabsTrigger 
            value="recipes" 
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500 text-sm"
          >
            <span className="text-lg">🍳</span>
            <span className="ml-1 font-semibold hidden sm:inline">Recipes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="blogs"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 text-sm"
          >
            <span className="text-lg">📝</span>
            <span className="ml-1 font-semibold hidden sm:inline">Blogs</span>
          </TabsTrigger>
          <TabsTrigger 
            value="articles"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 text-sm"
          >
            <span className="text-lg">📰</span>
            <span className="ml-1 font-semibold hidden sm:inline">Articles</span>
          </TabsTrigger>
          <TabsTrigger 
            value="music"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 text-sm"
          >
            <span className="text-lg">🎵</span>
            <span className="ml-1 font-semibold hidden sm:inline">Music</span>
          </TabsTrigger>
          <TabsTrigger 
            value="photography"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-500 text-sm"
          >
            <span className="text-lg">📸</span>
            <span className="ml-1 font-semibold hidden sm:inline">Photos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="projects"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-500 text-sm"
          >
            <span className="text-lg">💼</span>
            <span className="ml-1 font-semibold hidden sm:inline">Projects</span>
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

        <TabsContent value="photography">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-zinc-400">Photography management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-zinc-400">Projects management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
