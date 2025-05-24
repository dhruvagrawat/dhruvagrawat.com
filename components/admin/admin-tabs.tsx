"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
          <h2 className="text-2xl font-bold mb-4">Recipe Management</h2>
          <p className="text-zinc-400">Recipe admin panel will be implemented here.</p>
        </div>
      </TabsContent>
      <TabsContent value="blogs" className={`admin-section ${activeTab === "blogs" ? "visible" : ""}`}>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">Blog Management</h2>
          <p className="text-zinc-400">Blog admin panel will be implemented here.</p>
        </div>
      </TabsContent>
      <TabsContent value="articles" className={`admin-section ${activeTab === "articles" ? "visible" : ""}`}>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">Article Management</h2>
          <p className="text-zinc-400">Article admin panel will be implemented here.</p>
        </div>
      </TabsContent>
      <TabsContent value="music" className={`admin-section ${activeTab === "music" ? "visible" : ""}`}>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">Music Management</h2>
          <p className="text-zinc-400">Music admin panel will be implemented here.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
