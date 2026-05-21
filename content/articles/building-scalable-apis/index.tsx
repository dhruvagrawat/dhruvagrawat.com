import type { ArticleMeta } from "@/content/types"

export const metadata: ArticleMeta = {
  slug: "building-scalable-apis",
  title: "Building Scalable APIs with Node.js and PostgreSQL",
  description:
    "Practical patterns for designing APIs that stay fast and maintainable as your user base grows — connection pooling, query optimization, and caching strategies.",
  date: "2025-02-10",
  tags: ["Node.js", "PostgreSQL", "Backend", "APIs"],
  readTime: 8,
  coverImage: "/placeholder.svg?height=500&width=1000&text=Scalable+APIs",
  publication: "Personal",
}

export default function Content() {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <p>
        Scaling an API is not just about throwing more servers at the problem. The bottleneck is
        almost always the database. Getting the fundamentals right — connection pooling, indexed
        queries, and smart caching — takes you much further than horizontal scaling alone.
      </p>

      <h2>Connection Pooling</h2>
      <p>
        Each database connection is expensive. Opening a new connection per request kills
        performance at scale. Use a pool — <code>pg-pool</code> for raw Postgres or the built-in
        pooling in Prisma/Drizzle. A pool size of 10–20 connections per instance is a reasonable
        starting point.
      </p>
      <pre>
        <code>{`import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
})

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}`}</code>
      </pre>

      <h2>Index the Right Columns</h2>
      <p>
        A query that scans a million rows is a query that will eventually bring your API to its
        knees. Every column that appears in a <code>WHERE</code>, <code>JOIN ON</code>, or{" "}
        <code>ORDER BY</code> clause is a candidate for an index. Use <code>EXPLAIN ANALYZE</code>{" "}
        in psql to find sequential scans that should be index scans.
      </p>

      <h2>Pagination Over OFFSET</h2>
      <p>
        <code>OFFSET 10000</code> means Postgres reads and discards 10,000 rows before returning
        your page. Cursor-based pagination — storing the last seen ID or timestamp — is O(log n)
        instead and stays fast at any depth.
      </p>
      <pre>
        <code>{`-- Cursor pagination (much faster than OFFSET)
SELECT * FROM posts
WHERE id > $lastSeenId
ORDER BY id ASC
LIMIT 20`}</code>
      </pre>

      <h2>Response Caching with Redis</h2>
      <p>
        For read-heavy endpoints that rarely change, a cache dramatically reduces database load.
        Cache the serialized JSON, set a sensible TTL, and invalidate on writes.
      </p>
      <pre>
        <code>{`async function getPost(id: string) {
  const cached = await redis.get(\`post:\${id}\`)
  if (cached) return JSON.parse(cached)

  const post = await db.query("SELECT * FROM posts WHERE id = $1", [id])
  await redis.setex(\`post:\${id}\`, 300, JSON.stringify(post))
  return post
}`}</code>
      </pre>

      <h2>Rate Limiting</h2>
      <p>
        Protect your API from abusive clients by rate limiting at the edge (Cloudflare, Nginx) or
        in-process with a sliding window counter backed by Redis. Returning a{" "}
        <code>Retry-After</code> header helps well-behaved clients back off gracefully.
      </p>

      <h2>Closing Thoughts</h2>
      <p>
        Measure before you optimize. Add structured logging and a metrics layer (Prometheus,
        Datadog, or even a simple <code>performance.now()</code> wrapper) so you know exactly where
        time is being spent before reaching for a new abstraction.
      </p>
    </article>
  )
}
