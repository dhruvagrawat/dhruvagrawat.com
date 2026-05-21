import { allArticles } from "@/content/articles"
import { ArticleCard } from "@/components/article/article-card"

export const metadata = {
  title: "Articles | Dhruv Agrawat",
  description: "In-depth articles on engineering, systems, and software craft.",
}

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Articles</h1>
      <p className="text-muted-foreground mb-8">In-depth articles on engineering, systems, and software craft.</p>

      {allArticles.length === 0 ? (
        <p className="text-muted-foreground">No articles yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allArticles
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
        </div>
      )}
    </div>
  )
}
