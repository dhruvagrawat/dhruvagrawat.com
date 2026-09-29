/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { DATA } from "@/data/resume"
import { seoTitle } from "@/lib/seo"
import { ABOUT_UPDATED, oneLiner, personSchema, yearsExperience } from "@/lib/person"
import { TOOLS } from "@/lib/tools"
import { allBlogs } from "@/content/blogs"
import { allArticles } from "@/content/articles"
import { allRecipes } from "@/content/recipes"
import { isIndexable, publishedPlaces } from "@/content/travel/places"


const title = "About Dhruv Agrawat — Full-Stack Engineer in New Delhi"
const description =
  "Who Dhruv Agrawat is: full-stack software engineer, freelancer and co-founder of Quadcydle in New Delhi. Experience, skills, projects, writing and contact."

export const metadata: Metadata = {
  title: seoTitle(title),
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about", type: "profile", firstName: "Dhruv", lastName: "Agrawat", username: "dhruvagrawat" },
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

export default function AboutPage() {
  const quadcydle = DATA.work.find((w) => w.company === "Quadcydle")
  const current = DATA.work.filter((w) => w.end === "Present")
  const trips = publishedPlaces.filter((p) => p.status === "visited" && isIndexable(p))
  const profiles = Object.values(DATA.contact.social).filter((s) => s.url.startsWith("http"))
  const stack = DATA.skills.map((s) => s.name)


  const faq: { q: string; a: string }[] = [
    { q: "Who is Dhruv Agrawat?", a: `${oneLiner} He has ${yearsExperience}+ years of hands-on experience building web applications, automation tools and startup products.` },
    {
      q: "What does Dhruv Agrawat do?",
      a: `He builds full-stack web applications with ${stack.slice(0, 4).join(", ")} and modern cloud tooling. He co-founded the agency Quadcydle in ${quadcydle?.start ?? "2023"}, works as a freelance full-stack developer, and has delivered 30+ custom web applications for clients.`,
    },
    { q: "Where is Dhruv Agrawat based?", a: `${DATA.location}. He works with clients and teams remotely, including in the USA and Singapore.` },
    { q: "What is Quadcydle?", a: `Quadcydle (quadcydle.com) is a digital studio co-founded by Dhruv Agrawat. It builds, hosts, runs and grows websites and apps for small and remote businesses.` },
    { q: "What technologies does Dhruv Agrawat work with?", a: `${stack.join(", ")}, plus MongoDB, WebRTC and OpenCV in past projects.` },
    { q: "Where did Dhruv Agrawat study?", a: DATA.education.map((e) => `${e.degree} at ${e.school} (${e.start}–${e.end})`).join("; ") + "." },
    {
      q: "What does Dhruv Agrawat write about?",
      a: `Linux, Arch Linux, open source and developer tools on his blog; web security, freelancing, running an agency and Indian trekking destinations in his articles; and authentic Italian and Indian recipes. He also keeps a travel journal of Himalayan treks.`,
    },
    { q: "Is Dhruv Agrawat available for freelance work?", a: `Yes — he takes on freelance web development projects and is open to full-time roles. The best way to reach him is by email at ${DATA.contact.email}.` },
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${DATA.url}/about#page`,
        url: `${DATA.url}/about`,
        name: title,
        description,
        dateModified: ABOUT_UPDATED,
        isPartOf: { "@id": `${DATA.url}/#website` },
        mainEntity: { "@id": personSchema["@id"] },
      },
      personSchema,
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: DATA.url },
          { "@type": "ListItem", position: 2, name: "About", item: `${DATA.url}/about` },
        ],
      },
    ],
  }

  const facts: [string, React.ReactNode][] = [
    ["Name", DATA.name],
    ["Role", "Full-stack software engineer & freelancer"],
    ["Based in", DATA.location],
    [
      "Company",
      <>
        Co-founder,{" "}
        <a href="https://quadcydle.com" target="_blank" rel="noopener" className="text-primary underline-offset-4 hover:underline">Quadcydle</a>{" "}
        (since {quadcydle?.start})
      </>,
    ],
    ["Experience", `${yearsExperience}+ years · 30+ web apps delivered`],
    ["Education", `${DATA.education[0].degree}, ${DATA.education[0].school}`],
    ["Stack", stack.join(", ")],
    ["Email", <a key="e" href={`mailto:${DATA.contact.email}`} className="text-primary underline-offset-4 hover:underline">{DATA.contact.email}</a>],
  ]

  const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <h2 id={id} className="mb-6 scroll-mt-10 text-3xl leading-tight sm:text-4xl">{children}</h2>
  )

  return (
    <div className="mx-auto max-w-4xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden>/</span>
        <span>About</span>
      </nav>

      {/* ── Who ── */}
      <header className="grid gap-10 sm:grid-cols-[1fr_12rem] sm:items-end">
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">About</p>
          <h1 className="text-5xl leading-[0.95] sm:text-7xl">Dhruv Agrawat</h1>
          <p className="mt-6 text-xl leading-relaxed text-foreground/90 text-pretty">{oneLiner}</p>
        </div>
        <img
          src={`${DATA.avatarUrl}?size=400`}
          alt={`Portrait of ${DATA.name}`}
          width={400}
          height={400}
          className="mx-auto aspect-square w-40 rounded-3xl bg-muted object-cover ring-1 ring-border sm:w-full"
        />
      </header>

      {/* Quick facts — the same facts as the structured data, in plain text */}
      <section aria-labelledby="facts" className="mt-14">
        <h2 id="facts" className="sr-only">Quick facts</h2>
        <dl className="grid gap-x-10 border-t sm:grid-cols-2">
          {facts.map(([k, v]) => (
            <div key={k} className="flex gap-4 border-b py-3 text-sm">
              <dt className="w-24 shrink-0 pt-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-20 space-y-20">
        {/* ── What I do ── */}
        <section aria-labelledby="what">
          <H2 id="what">What I do</H2>
          <div className="space-y-5 text-[17px] leading-relaxed text-foreground/85">
            <p>{DATA.summary}</p>
            <p>
              Right now I&apos;m {current.map((w, i) => (
                <span key={w.company}>
                  {i > 0 && " and "}
                  {w.company === "Freelance" ? "freelancing as a full-stack developer" : <>{w.title.toLowerCase()} at <strong>{w.company}</strong></>}
                </span>
              ))}
              . At <a href="https://quadcydle.com" target="_blank" rel="noopener" className="text-primary underline-offset-4 hover:underline">Quadcydle</a> we build, host, run and grow websites and apps for small and remote businesses — I lead full-stack development, hiring, mentoring and delivery.
            </p>
            <p>
              Most of what I ship is built with {stack.slice(0, 4).join(", ")} and PostgreSQL or MongoDB, deployed with Docker and modern cloud platforms. I care about sites that stay fast, secure and easy to maintain long after launch.
            </p>
          </div>
        </section>

        {/* ── Experience ── */}
        <section aria-labelledby="experience">
          <H2 id="experience">Experience</H2>
          <ol className="space-y-8 border-l pl-6">
            {DATA.work.map((w) => (
              <li key={w.company + w.start} className="relative">
                <span aria-hidden className="absolute -left-[29px] top-2 size-2.5 rounded-full bg-primary" />
                <h3 className="font-display text-2xl leading-tight">
                  {w.title} · {w.href ? <a href={w.href} target="_blank" rel="noopener" className="hover:underline">{w.company}</a> : w.company}
                </h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{w.start} – {w.end} · {w.location}</p>
                <p className="mt-2 text-muted-foreground">{w.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Education ── */}
        <section aria-labelledby="education">
          <H2 id="education">Education</H2>
          <ul className="space-y-4">
            {DATA.education.map((e) => (
              <li key={e.school}>
                <h3 className="font-display text-2xl leading-tight">{e.degree}</h3>
                <p className="text-muted-foreground">{e.school} · {e.start}–{e.end}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Projects ── */}
        <section aria-labelledby="projects">
          <H2 id="projects">Things I&apos;ve built</H2>
          <ul className="space-y-4">
            {DATA.projects.map((p) => (
              <li key={p.title}>
                <h3 className="font-display text-2xl leading-tight">{p.title} <span className="font-mono text-xs text-muted-foreground">{p.dates}</span></h3>
                <p className="text-muted-foreground">{p.description} Built with {p.technologies.join(", ")}.</p>
              </li>
            ))}
            <li>
              <h3 className="font-display text-2xl leading-tight">This website</h3>
              <p className="text-muted-foreground">
                dhruvagrawat.com — a Next.js site with a blog, articles, recipes, a 3D travel globe, photography and {TOOLS.filter((t) => !t.noindex).length} free <Link href="/tools" className="text-primary underline-offset-4 hover:underline">browser tools</Link>.
              </p>
            </li>
          </ul>
          <Link href="/projects" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">All projects <ArrowUpRight className="size-4" /></Link>
        </section>

        {/* ── Writing ── */}
        <section aria-labelledby="writing">
          <H2 id="writing">What I write about</H2>
          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="/blogs" className="rounded-3xl border bg-card p-6 hover:border-primary/40">
              <p className="font-display text-2xl">Blog</p>
              <p className="mt-2 text-sm text-muted-foreground">{allBlogs.length} posts on Linux, Arch Linux, the terminal, SSH, dotfiles and open-source tools.</p>
            </Link>
            <Link href="/articles" className="rounded-3xl border bg-card p-6 hover:border-primary/40">
              <p className="font-display text-2xl">Articles</p>
              <p className="mt-2 text-sm text-muted-foreground">{allArticles.length} guides on web security, running an agency, freelancing and treks in India.</p>
            </Link>
            <Link href="/resipy" className="rounded-3xl border bg-card p-6 hover:border-primary/40">
              <p className="font-display text-2xl">Recipes</p>
              <p className="mt-2 text-sm text-muted-foreground">{allRecipes.length} recipes — authentic Italian pasta and North Indian classics like dal makhani and biryani.</p>
            </Link>
          </div>
        </section>

        {/* ── Outside work ── */}
        <section aria-labelledby="outside">
          <H2 id="outside">Outside work</H2>
          <p className="text-[17px] leading-relaxed text-foreground/85">
            When I&apos;m not building, I&apos;m usually in the mountains. I trek in the Himalayas — in snow in Uttarakhand in winter and along the Dhauladhar range in Himachal in summer — and I photograph almost everything along the way. The trips go into my{" "}
            <Link href="/travel" className="text-primary underline-offset-4 hover:underline">travel journal</Link>, and the photos into my{" "}
            <Link href="/photography" className="text-primary underline-offset-4 hover:underline">photography</Link> page.
          </p>
          {trips.length > 0 && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {trips.map((p) => (
                <li key={p.slug}>
                  <Link href={`/travel/${p.slug}`} className="flex items-baseline justify-between gap-4 rounded-2xl border bg-card px-5 py-4 hover:border-primary/40">
                    <span className="font-display text-xl">{p.name}</span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{p.when}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── FAQ ── */}
        <section aria-labelledby="faq">
          <H2 id="faq">Quick answers</H2>
          <div className="divide-y border-y">
            {faq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none font-display text-xl marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Contact ── */}
        <section aria-labelledby="contact" className="rounded-3xl border bg-card p-8">
          <H2 id="contact">Work with me</H2>
          <p className="text-[17px] leading-relaxed text-foreground/85">
            I take on freelance web development projects and I&apos;m open to full-time roles. Email me at{" "}
            <a href={`mailto:${DATA.contact.email}`} className="text-primary underline-offset-4 hover:underline">{DATA.contact.email}</a>.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {profiles.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="me noopener" className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">{s.name}</a>
              </li>
            ))}
          </ul>
        </section>

        <p className="font-mono text-xs text-muted-foreground">
          Last updated <time dateTime={ABOUT_UPDATED}>{fmt(ABOUT_UPDATED)}</time>
        </p>
      </div>
    </div>
  )
}
