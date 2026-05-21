import type { BlogMeta } from "@/content/types"

export const metadata: BlogMeta = {
  slug: "getting-started-with-nextjs",
  title: "Getting Started with Next.js 15",
  description:
    "A practical guide to building your first production-ready app with Next.js 15, the App Router, and server components.",
  date: "2025-01-15",
  tags: ["Next.js", "React", "Web Dev"],
  readTime: 6,
  coverImage: "/placeholder.svg?height=500&width=1000&text=Next.js+15",
}

export default function Content() {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <p>
        Next.js 15 brings a dramatically improved developer experience alongside serious performance
        wins. If you&apos;ve been on the fence about adopting the App Router, now is the time.
      </p>

      <h2>Why the App Router Changes Everything</h2>
      <p>
        The App Router moves rendering closer to the data. Server Components fetch data and stream
        HTML directly — no client-side waterfall, no <code>useEffect</code> fetch chains. Your page
        loads faster, your bundle is smaller, and you write less code.
      </p>

      <h2>Setting Up Your Project</h2>
      <p>
        Bootstrap a new project with a single command. Choose TypeScript, Tailwind, and the App
        Router when prompted.
      </p>
      <pre>
        <code>{`npx create-next-app@latest my-app
cd my-app
npm run dev`}</code>
      </pre>

      <h2>Your First Server Component</h2>
      <p>
        Every file in <code>app/</code> is a Server Component by default. You can fetch data
        directly at the top of the component — no hooks, no loading state, no boilerplate.
      </p>
      <pre>
        <code>{`// app/posts/page.tsx
async function getPosts() {
  const res = await fetch("https://api.example.com/posts")
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}`}</code>
      </pre>

      <h2>When to Add "use client"</h2>
      <p>
        Only add <code>&quot;use client&quot;</code> when you genuinely need browser APIs, event
        handlers, or stateful hooks. Keep client boundaries as deep in the tree as possible — a
        small interactive button doesn&apos;t need to make the whole page a client component.
      </p>

      <h2>Static vs Dynamic Rendering</h2>
      <p>
        By default, routes are statically rendered at build time. Opt into dynamic rendering with{" "}
        <code>export const dynamic = &apos;force-dynamic&apos;</code> or by reading cookies,
        headers, or search params. Use <code>generateStaticParams</code> for dynamic routes that
        should still be statically generated.
      </p>

      <h2>What&apos;s Next?</h2>
      <p>
        From here, explore Parallel Routes for complex layouts, Server Actions for form handling
        without API routes, and Partial Prerendering for the best of static and dynamic in a single
        page. The App Router is the foundation — build on it confidently.
      </p>
    </article>
  )
}
