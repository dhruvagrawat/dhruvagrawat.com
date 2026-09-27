/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, MapPin } from "lucide-react"
import { DATA } from "@/data/resume"
import TimeTravelButton from "@/components/time-travel-button"
import HackathonsSection from "@/components/section/hackathons-section"
import { SummitHero } from "@/components/summit/hero"
import { Kicker, Rise, SmoothScroll, WordsReveal, CurtainImage } from "@/components/summit/motion"
import { TrailNav } from "@/components/summit/trail-nav"
import { SummitContact, ToolsTeaser, TrailGallery, WorkTrail } from "@/components/summit/sections"

export const metadata = {
  alternates: { canonical: "/" },
}

const firstWorkYear = Math.min(...DATA.work.map((w) => Number(w.start.match(/\d{4}/)?.[0] ?? 9999)))
const yearsExp = new Date().getFullYear() - firstWorkYear

/* ---------- Structured data: who this is, for search engines and AI assistants ---------- */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${DATA.url}/#website`,
      url: DATA.url,
      name: DATA.name,
      description: DATA.description,
      inLanguage: "en",
      publisher: { "@id": `${DATA.url}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${DATA.url}/#profile`,
      url: DATA.url,
      name: `${DATA.name} — Full-Stack Software Engineer`,
      isPartOf: { "@id": `${DATA.url}/#website` },
      mainEntity: { "@id": `${DATA.url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${DATA.url}/#person`,
      name: DATA.name,
      url: DATA.url,
      image: DATA.avatarUrl,
      jobTitle: "Full-Stack Software Engineer",
      description: DATA.summary,
      email: `mailto:${DATA.contact.email}`,
      address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
      worksFor: { "@type": "Organization", name: DATA.work[0].company },
      alumniOf: DATA.education.map((e) => ({ "@type": "EducationalOrganization", name: e.school })),
      knowsAbout: DATA.skills.map((s) => s.name),
      sameAs: Object.values(DATA.contact.social)
        .filter((s) => s.url.startsWith("http"))
        .map((s) => s.url),
    },
  ],
}

function Section({
  id,
  camp,
  label,
  title,
  italicLast,
  children,
  className = "",
}: {
  id: string
  camp: string
  label: string
  title: string
  italicLast?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`mx-auto w-full max-w-5xl scroll-mt-8 px-6 py-24 sm:py-32 ${className}`}>
      <Kicker camp={camp} label={label} />
      <WordsReveal id={`${id}-title`} text={title} italicLast={italicLast} className="mb-12 max-w-3xl text-4xl leading-[1.02] sm:text-6xl" />
      {children}
    </section>
  )
}

export default function Page() {
  const facts: [string, React.ReactNode][] = [
    ["Role", "Full-stack software engineer & freelancer"],
    ["Based in", DATA.location],
    ["Experience", `${yearsExp}+ years building for startups, agencies and clients`],
    ["Shipped", "30+ custom web applications"],
    ["Currently", `Co-founder at ${DATA.work[0].company}`],
    ["Focus", "React, Next.js, Node.js, PostgreSQL"],
    ["Contact", <a key="e" href={`mailto:${DATA.contact.email}`} className="text-primary underline-offset-4 hover:underline">{DATA.contact.email}</a>],
  ]

  return (
    <div className="relative -mx-6 -mb-24 -mt-12 sm:-mt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SmoothScroll />
      <TrailNav />
      <TimeTravelButton />

      <main>
        <SummitHero />

        {/* ───────────── Base camp · About ───────────── */}
        <Section id="about" className="!pt-6 sm:!pt-10" camp="Base camp" label="About" title="I build web products that hold up when real people use them." italicLast>
          <div className="grid gap-12 md:grid-cols-[1fr_17rem] md:gap-16">
            <div className="space-y-6">
              <Rise>
                <p className="text-xl leading-relaxed text-foreground/90 sm:text-2xl">{DATA.description}</p>
              </Rise>
              <Rise delay={0.08}>
                <p className="text-[17px] leading-relaxed text-muted-foreground">{DATA.summary}</p>
              </Rise>
              {/* Quick facts — plain, scannable text for people, search engines and AI assistants alike */}
              <Rise delay={0.12}>
                <dl className="mt-4 grid gap-x-8 border-t pt-6 sm:grid-cols-2">
                  {facts.map(([k, v]) => (
                    <div key={k} className="flex gap-4 border-b py-3 text-sm">
                      <dt className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground pt-0.5">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </Rise>
            </div>

            <Rise delay={0.15} className="mx-auto w-56 md:mx-0 md:w-full">
              <figure className="rotate-[2.5deg] rounded-sm bg-card p-3 pb-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-border transition-transform duration-500 hover:rotate-0">
                <img
                  src={`${DATA.avatarUrl}?size=460`}
                  alt={`Portrait of ${DATA.name}`}
                  width={460}
                  height={460}
                  loading="lazy"
                  className="aspect-square w-full bg-muted object-cover"
                />
                <figcaption className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                  <span>{DATA.name}</span>
                  <span className="flex items-center gap-1"><MapPin className="size-3" /> Delhi</span>
                </figcaption>
              </figure>
            </Rise>
          </div>
        </Section>

        {/* ───────────── Camp I · Work ───────────── */}
        <Section id="work" camp="Camp I" label="Work" title="Where I've been working." italicLast>
          <WorkTrail />
        </Section>

        {/* ───────────── Camp II · The trail (photos) ───────────── */}
        <TrailGallery />

        {/* ───────────── Camp III · Projects ───────────── */}
        <Section id="projects" camp="Camp III" label="Projects" title="A few things I've built." italicLast>
          <ol className="grid gap-5">
            {DATA.projects.map((p, i) => (
              <li key={p.title}>
                <Rise delay={i * 0.06}>
                  <article className="group grid gap-4 rounded-3xl border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] sm:grid-cols-[5rem_1fr_auto] sm:items-start sm:p-8">
                    <span className="font-display text-5xl leading-none text-primary/80">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-3xl leading-tight">{p.title}</h3>
                      <p className="mt-2 max-w-2xl text-muted-foreground">{p.description}</p>
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
                        {p.technologies.map((t) => (
                          <li key={t} className="rounded-full border px-3 py-1 font-mono text-[11px] text-muted-foreground">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <time className="font-mono text-xs text-muted-foreground">{p.dates}</time>
                  </article>
                </Rise>
              </li>
            ))}
          </ol>
          <Rise delay={0.2} className="mt-8">
            <a href="/projects" className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              All projects <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Rise>
        </Section>

        {/* ───────────── Camp IV · Skills, education, tools ───────────── */}
        <section id="skills" aria-labelledby="skills-title" className="scroll-mt-8 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <Kicker camp="Camp IV" label="Skills" />
            <WordsReveal id="skills-title" text="The kit I carry." italicLast className="mb-12 text-4xl leading-[1.02] sm:text-6xl" />
          </div>

          {/* two rows of skills gliding in opposite directions */}
          <div className="pause-on-hover space-y-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" aria-label="Skills">
            {[0, 1].map((row) => (
              <div key={row} className={`flex w-max gap-3 ${row ? "animate-marquee-reverse" : "animate-marquee"}`} aria-hidden={row === 1}>
                {[...DATA.skills, ...DATA.skills, ...DATA.skills, ...DATA.skills].map((s, i) => (
                  <span key={i} className="flex items-center gap-2.5 rounded-full border bg-card px-5 py-2.5 text-sm font-medium">
                    <s.icon className="size-5" />
                    {s.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <ul className="sr-only">
            {DATA.skills.map((s) => (
              <li key={s.name}>{s.name}</li>
            ))}
          </ul>

          <div className="mx-auto mt-20 grid max-w-5xl gap-16 px-6 md:grid-cols-[1fr_1.4fr]">
            <div>
              <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Education</h3>
              <ul className="space-y-6">
                {DATA.education.map((e, i) => (
                  <Rise key={e.school} delay={i * 0.06}>
                    <li>
                      <p className="font-display text-2xl leading-tight">{e.school}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {e.degree} · <time>{e.start}</time>–<time>{e.end}</time>
                      </p>
                    </li>
                  </Rise>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Free tools I&apos;ve built</h3>
              <ToolsTeaser />
            </div>
          </div>

          {DATA.hackathons.length > 0 && (
            <div className="mx-auto mt-24 max-w-4xl px-6">
              <HackathonsSection />
            </div>
          )}

          {/* one more photo before the summit */}
          <div className="mx-auto mt-24 max-w-5xl px-6">
            <CurtainImage
              src="/summit/g5-1600.webp"
              srcSmall="/summit/g5-800.webp"
              alt="Cloud pouring over dark forested ridges"
              className="aspect-[21/9] rounded-3xl"
            />
          </div>
        </section>

        {/* ───────────── Summit · Contact ───────────── */}
        <SummitContact />
      </main>
    </div>
  )
}
