"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecipeAdmin } from "@/components/admin/recipe-admin"
import { BlogAdmin } from "@/components/admin/blog-admin"
import { ArticleAdmin } from "@/components/admin/article-admin"
import { MusicAdmin } from "@/components/admin/music-admin"

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState("recipes")

  return (
    <Tabs defaultValue="recipes" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="recipes">Recipes</TabsTrigger>
        <TabsTrigger value="blogs">Blogs</TabsTrigger>
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="music">Music</TabsTrigger>
      </TabsList>
      <TabsContent value="recipes" className={`admin-section ${activeTab === "recipes" ? "visible" : ""}`}>
        <RecipeAdmin />
      </TabsContent>
      <TabsContent value="blogs" className={`admin-section ${activeTab === "blogs" ? "visible" : ""}`}>
        <BlogAdmin />
      </TabsContent>
      <TabsContent value="articles" className={`admin-section ${activeTab === "articles" ? "visible" : ""}`}>
        <ArticleAdmin />
      </TabsContent>
      <TabsContent value="music" className={`admin-section ${activeTab === "music" ? "visible" : ""}`}>
        <MusicAdmin />
      </TabsContent>
    </Tabs>
  )
}
