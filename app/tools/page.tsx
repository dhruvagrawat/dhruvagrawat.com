"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { CATEGORY_INFO, CATEGORY_ORDER, TOOLS, type ToolDef } from "@/lib/tools"

type Tool = ToolDef

const categories = CATEGORY_ORDER.map((name) => ({
  name,
  description: CATEGORY_INFO[name],
  tools: TOOLS.filter((t) => t.category === name),
})).filter((c) => c.tools.length > 0)

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon
  return (
    <Link href={`/${tool.slug}`}>
      <div className="group flex items-start gap-4 rounded-xl border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all duration-150">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-sm">{tool.label}</span>
            {tool.isNew && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                New
              </span>
            )}
            {tool.badge && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {tool.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{tool.blurb}</p>
        </div>
      </div>
    </Link>
  )
}

function Category({ cat, defaultOpen = false }: { cat: typeof categories[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mb-4 rounded-2xl border bg-card/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
      >
        <div className="text-left">
          <h2 className="font-semibold">{cat.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-xs text-muted-foreground">{cat.tools.length} tools</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-4">
          {cat.tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MorePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Free Online Tools</h1>
        <p className="text-muted-foreground text-lg">
          {TOOLS.filter((t) => t.category !== "Services").length} fast, ad-free tools I&apos;ve built
          and use day-to-day — most run entirely in your browser.
        </p>
      </div>

      {categories.map((cat, i) => (
        <Category key={cat.name} cat={cat} defaultOpen={i < 2} />
      ))}
    </div>
  )
}
