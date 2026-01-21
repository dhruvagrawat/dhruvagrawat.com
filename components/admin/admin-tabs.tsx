"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecipeAdmin } from "./recipe-admin"
import { BlogAdmin } from "./blog-admin"
import { ArticleAdmin } from "./article-admin"
import { MusicAdmin } from "./music-admin"

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState("recipes")

  return (
    <Tabs defaultValue="recipes" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 mb-8 bg-zinc-800">
        <TabsTrigger value="recipes" className="data-[state=active]:bg-zinc-700">
          Recipes
        </TabsTrigger>
        <TabsTrigger value="blogs" className="data-[state=active]:bg-zinc-700">
          Blogs
        </TabsTrigger>
        <TabsTrigger value="articles" className="data-[state=active]:bg-zinc-700">
          Articles
        </TabsTrigger>
        <TabsTrigger value="music" className="data-[state=active]:bg-zinc-700">
          Music
        </TabsTrigger>
      </TabsList>
      <TabsContent value="recipes" className={`admin-section ${activeTab === "recipes" ? "visible" : ""}`}>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <RecipeAdmin />
        </div>
      </TabsContent>
      <TabsContent value="blogs" className={`admin-section ${activeTab === "blogs" ? "visible" : ""}`}>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <BlogAdmin />
        </div>
      </TabsContent>
      <TabsContent value="articles" className={`admin-section ${activeTab === "articles" ? "visible" : ""}`}>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <ArticleAdmin />
        </div>
      </TabsContent>
      <TabsContent value="music" className={`admin-section ${activeTab === "music" ? "visible" : ""}`}>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <MusicAdmin />
        </div>
      </TabsContent>
    </Tabs>
  )
}
