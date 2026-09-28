/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, Flame, Gauge, Leaf, Timer, Users } from "lucide-react"
import { allRecipes, recipeRegistry } from "@/content/recipes"
import { DATA } from "@/data/resume"
import { seoTitle } from "@/lib/seo"
import { Markdown } from "@/components/writing/markdown"
import { IngredientChecklist, Method, PrintButton, RecipePlate } from "@/components/recipe/recipe-ui"

const iso = (min: number) => `PT${Math.floor(min / 60) ? `${Math.floor(min / 60)}H` : ""}${min % 60 ? `${min % 60}M` : ""}` || "PT0M"
const realCover = (s?: string) => (s && !s.includes("placeholder") ? s : undefined)

export function generateStaticParams() {
  return Object.keys(recipeRegistry).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const loader = recipeRegistry[slug]
  if (!loader) return {}
  const { metadata: r } = await loader()
  const title = `${r.title.replace(/\s*\(.*?\)/, "")} Recipe${r.cuisine ? ` — ${r.cuisine}` : ""}`
  const cover = realCover(r.coverImage)
  return {
    title: seoTitle(title),
    description: r.description,
    keywords: [...r.tags, ...(r.keywords ?? [])],
    authors: [{ name: DATA.name, url: DATA.url }],
    alternates: { canonical: `/resipy/${r.slug}` },
    openGraph: {
      type: "article",
      url: `/resipy/${r.slug}`,
      title,
      description: r.description,
      publishedTime: r.date,
      authors: [DATA.name],
      tags: r.tags,
      ...(cover ? { images: [{ url: cover, alt: r.title }] } : {}),
    },
  }
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = recipeRegistry[slug]
  if (!loader) notFound()
  const { metadata: r, default: LegacyContent } = await loader()
  const cover = realCover(r.coverImage)
  const groups = r.ingredientGroups ?? [{ title: "Ingredients", items: r.ingredients }]
  const url = `${DATA.url}/resipy/${r.slug}`
  const more = allRecipes.filter((x) => x.slug !== r.slug && (x.cuisine ?? x.category) === (r.cuisine ?? r.category)).slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: r.title,
        description: r.description,
        url,
        image: cover ? [`${DATA.url}${cover}`] : [`${url}/opengraph-image`],
        author: { "@type": "Person", name: DATA.name, url: DATA.url },
        datePublished: r.date,
        prepTime: iso(r.prepTime),
        cookTime: iso(r.cookTime),
        totalTime: iso(r.prepTime + r.cookTime),
        recipeYield: `${r.servings} servings`,
        recipeCategory: r.category,
        ...(r.cuisine ? { recipeCuisine: r.cuisine } : {}),
        ...(r.vegetarian ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
        keywords: [...r.tags, ...(r.keywords ?? [])].join(", "),
        recipeIngredient: r.ingredients,
        ...(r.steps
          ? {
              recipeInstructions: r.steps.map((s) => ({
                "@type": "HowToSection",
                name: s.title,
                itemListElement: s.items.map((t) => ({ "@type": "HowToStep", text: t })),
              })),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: DATA.url },
          { "@type": "ListItem", position: 2, name: "Recipes", item: `${DATA.url}/resipy` },
          { "@type": "ListItem", position: 3, name: r.title, item: url },
        ],
      },
    ],
  }

  const stats = [
    { icon: Timer, label: "Prep", value: `${r.prepTime} min` },
    { icon: Flame, label: "Cook", value: `${r.cookTime} min` },
    { icon: Clock, label: "Total", value: `${r.prepTime + r.cookTime} min` },
    { icon: Users, label: "Serves", value: String(r.servings) },
    ...(r.difficulty ? [{ icon: Gauge, label: "Effort", value: r.difficulty }] : []),
  ]

  return (
    <article className="mx-auto max-w-6xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground print:hidden">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/resipy" className="hover:text-foreground">Recipes</Link>
      </nav>

      <header className="grid items-end gap-10 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-primary">{r.cuisine ?? r.category}</span>
            {r.vegetarian && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 px-2 py-0.5 normal-case tracking-normal text-emerald-700 dark:text-emerald-400">
                <Leaf className="size-3" /> Vegetarian
              </span>
            )}
          </p>
          <h1 className="text-5xl leading-[0.95] text-balance sm:text-7xl">{r.title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{r.description}</p>
          <p className="mt-5 flex items-center gap-3 text-sm">
            <span>By <Link href="/" rel="author" className="font-semibold hover:underline">{DATA.name}</Link></span>
            <PrintButton />
          </p>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-3xl border">
          {cover ? <img src={cover} alt={r.title} className="h-full w-full object-cover" /> : <RecipePlate r={r} big />}
        </div>
      </header>

      <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-4">
            <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <s.icon className="size-3.5" /> {s.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      {r.intro && (
        <div className="mx-auto mt-14 max-w-2xl">
          <Markdown source={r.intro} className="prose prose-lg max-w-none text-foreground dark:prose-invert prose-p:text-foreground/85 prose-headings:font-display prose-headings:font-normal" />
        </div>
      )}

      <div className="mt-14 grid gap-12 lg:grid-cols-[22rem_1fr]">
        <aside>
          <div className="rounded-3xl border bg-card p-6 lg:sticky lg:top-10">
            <h2 className="mb-4 font-display text-3xl">Ingredients</h2>
            <IngredientChecklist groups={groups} />
          </div>
        </aside>
        <div>
          <h2 className="mb-6 font-display text-3xl">Method</h2>
          {r.steps ? <Method steps={r.steps} /> : <LegacyContent />}

          {r.tips && r.tips.length > 0 && (
            <section className="mt-12 rounded-3xl border border-primary/25 bg-primary/[0.04] p-6">
              <h2 className="mb-3 font-display text-2xl">Tips that make the difference</h2>
              <ul className="list-disc space-y-2 pl-5 text-foreground/85">
                {r.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <section aria-labelledby="more" className="mt-24 border-t pt-12 print:hidden">
          <h2 id="more" className="mb-8 font-display text-3xl">More {r.cuisine ?? r.category} recipes</h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={`/resipy/${m.slug}`} className="group block overflow-hidden rounded-3xl border bg-card transition-all hover:-translate-y-1">
                  <div className="aspect-[16/10]">
                    {realCover(m.coverImage) ? <img src={m.coverImage} alt="" className="h-full w-full object-cover" /> : <RecipePlate r={m} />}
                  </div>
                  <p className="p-5 font-display text-xl">{m.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
