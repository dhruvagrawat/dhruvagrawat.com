import type { Metadata } from "next"
import { allRecipes } from "@/content/recipes"
import { DATA } from "@/data/resume"
import { RecipeBrowser } from "@/components/recipe/recipe-ui"

const title = "Recipes — Authentic Italian Pasta & North Indian Classics"
const description =
  "Tested home recipes: authentic Italian pasta like arrabbiata, fettuccine Alfredo and cacio e pepe, plus North Indian classics — dal makhani, shahi paneer and veg dum biryani."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/resipy" },
  openGraph: { title, description, url: "/resipy" },
}

export default function RecipesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Recipes by " + DATA.name,
    itemListElement: allRecipes.map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `${DATA.url}/resipy/${r.slug}` })),
  }
  return (
    <div className="mx-auto max-w-6xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="mb-12 max-w-3xl">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Resipy · Recipes</p>
        <h1 className="text-5xl leading-[0.95] sm:text-7xl">
          Food I actually <span className="italic">cook.</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          The Italian classics done the way Rome does them, and the North Indian dishes I grew up on — written step by step, with the small details that make them work.
        </p>
      </header>
      <RecipeBrowser recipes={allRecipes} />
    </div>
  )
}
