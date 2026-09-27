"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { DATA } from "@/data/resume"
import { TOOLS } from "@/lib/tools"
import { Rise } from "./motion"

/* ============ Work: a trail that draws itself as you scroll ============ */
export function WorkTrail() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] })
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 })

  return (
    <ol ref={ref} className="relative ml-2 sm:ml-0">
      {/* the trail */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border sm:left-[calc(9rem+7px)]" aria-hidden />
      <motion.div
        aria-hidden
        className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-primary sm:left-[calc(9rem+7px)]"
        style={{ scaleY: reduce ? 1 : draw }}
      />
      {DATA.work.map((w, i) => (
        <li key={w.company + w.start} className="relative grid gap-1 pb-12 pl-9 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-10 sm:pl-0">
          <Rise delay={0.05} y={20} className="font-mono text-xs uppercase tracking-wider text-muted-foreground sm:pt-1.5 sm:text-right sm:pr-4">
            <time>{w.start}</time> — <time>{w.end}</time>
          </Rise>
          <span
            aria-hidden
            className="absolute left-0 top-1.5 size-[15px] rotate-45 border-2 border-primary bg-background sm:left-[9rem]"
          />
          <Rise delay={0.1 + i * 0.02} className="sm:pl-8">
            <h3 className="font-display text-2xl leading-tight sm:text-3xl">
              {w.company}
              {w.end === "Present" && (
                <span className="ml-3 inline-flex translate-y-[-4px] items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2 py-0.5 align-middle font-sans text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" /> Now
                </span>
              )}
            </h3>
            <p className="mt-1 text-sm font-medium">
              {w.title} <span className="font-normal text-muted-foreground">· {w.location}</span>
            </p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{w.description}</p>
          </Rise>
        </li>
      ))}
    </ol>
  )
}

/* ============ The trail: pinned section that glides sideways ============ */
const SHOTS = [
  { k: "g1", alt: "Snow slope and a jagged peak under drifting clouds", cap: "Above the snowline" },
  { k: "g4", alt: "Steep snowfield rising to a ridge under grey cloud", cap: "Whiteout on the ridge" },
  { k: "g3", alt: "Sunlight breaking through clouds over a misty valley", cap: "Sun through the clouds" },
  { k: "g2", alt: "The Ganga flowing past rocks and ghats with hills behind", cap: "By the river" },
  { k: "g7", alt: "Alpine valley full of boulders and green grass below misty peaks", cap: "Boulder valley" },
  { k: "g8", alt: "Grey storm clouds rolling over a forested mountain valley", cap: "Storm coming in" },
  { k: "g6", alt: "Rocky forest trail disappearing into the fog between pine trees", cap: "Into the fog" },
]

export function TrailGallery() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  // Only desktop gets the pinned sideways glide; phones swipe natively.
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  // how far the strip must travel so the last photo ends up in view
  const trackRef = useRef<HTMLUListElement>(null)
  const [travel, setTravel] = useState(0)
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current
      if (el) setTravel(Math.max(0, el.scrollWidth - window.innerWidth + 48))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [desktop])
  const x = useTransform(scrollYProgress, [0.05, 0.95], reduce || !desktop ? [0, 0] : [0, -travel])
  const xs = useSpring(x, { stiffness: 140, damping: 30, mass: 0.35 })

  return (
    <section ref={ref} id="trail" aria-labelledby="trail-title" className="relative md:h-[320vh]">
      <div className="md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:overflow-hidden">
        <div className="mx-auto mb-8 w-full max-w-5xl px-6">
          <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            <svg viewBox="0 0 12 10" className="size-3 text-primary" aria-hidden><path d="M6 0 12 10H0z" fill="currentColor" /></svg>
            Camp II <span className="h-px w-8 bg-border" /> The trail
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="trail-title" className="font-display text-4xl leading-none sm:text-6xl">
              When I&apos;m not <span className="italic">shipping</span>, I&apos;m walking uphill.
            </h2>
            <a href="/photography" className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              All photographs <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* mobile: native swipe; desktop: glides with scroll */}
        <motion.ul
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:snap-none md:overflow-visible md:pl-[max(1.5rem,calc((100vw-64rem)/2))] md:pb-0"
          style={{ x: xs }}
        >
          {SHOTS.map((s, i) => (
            <li
              key={s.k}
              className={`w-[78vw] shrink-0 snap-center sm:w-[46vw] md:w-[34vw] ${i % 2 ? "md:translate-y-10" : "md:-translate-y-4"}`}
            >
              <figure>
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={`/summit/${s.k}-800.webp`}
                    srcSet={`/summit/${s.k}-800.webp 800w, /summit/${s.k}-1600.webp 1600w`}
                    sizes="(max-width: 768px) 78vw, 34vw"
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]"
                    style={{ filter: "var(--photo-filter)" }}
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{s.cap}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/* ============ Summit: contact, with the view from the top ============ */
export function SummitContact() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.3, 1])
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-10%", "0%"])
  const radius = useTransform(scrollYProgress, [0, 0.8], reduce ? ["0px", "0px"] : ["48px", "0px"])
  const socials = Object.values(DATA.contact.social).filter((s) => s.navbar)

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative">
      <motion.div className="relative min-h-svh overflow-hidden" style={{ borderTopLeftRadius: radius, borderTopRightRadius: radius }}>
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale, y }}>
          <picture>
            <source media="(max-width: 900px)" srcSet="/summit/summit-1280.webp" />
            <img
              src="/summit/summit-2400.webp"
              alt="Sunrise over a hill town and forested mountains, seen from above"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </picture>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

        <div className="relative mx-auto flex min-h-svh max-w-5xl flex-col justify-end px-6 pb-36 pt-32 text-white">
          <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-white/70">
            <svg viewBox="0 0 12 10" className="size-3 text-white" aria-hidden><path d="M6 0 12 10H0z" fill="currentColor" /></svg>
            Summit <span className="h-px w-8 bg-white/30" /> Contact
          </p>
          <Rise>
            <h2 id="contact-title" className="font-display text-5xl leading-[0.95] sm:text-7xl md:text-8xl">
              Let&apos;s build something <span className="italic">worth the climb.</span>
            </h2>
          </Rise>
          <Rise delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              I&apos;m open to freelance projects and interesting full-time roles. Tell me what you&apos;re building —
              I reply to every real message.
            </p>
          </Rise>
          <Rise delay={0.2} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${DATA.contact.email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              {DATA.contact.email}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <s.icon className="size-4" />
                {s.name}
              </a>
            ))}
          </Rise>
        </div>
      </motion.div>
    </section>
  )
}

/* ============ Tools teaser (also great internal linking for SEO) ============ */
export function ToolsTeaser() {
  const picks = ["emi-calculator", "json-formatter", "gst-calculator", "image-compressor", "qr", "sip-calculator"]
    .map((s) => TOOLS.find((t) => t.slug === s)!)
    .filter(Boolean)
  const count = TOOLS.filter((t) => t.category !== "Services").length
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {picks.map((t, i) => {
        const Icon = t.icon
        return (
          <Rise key={t.slug} delay={i * 0.05}>
            <a
              href={`/${t.slug}`}
              className="group flex h-full items-start gap-3 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_30px_-15px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-4" aria-hidden />
              </span>
              <span>
                <span className="flex items-center gap-1 text-sm font-semibold">
                  {t.label}
                  <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="text-xs text-muted-foreground">{t.blurb}</span>
              </span>
            </a>
          </Rise>
        )
      })}
      <Rise delay={0.3} className="sm:col-span-2">
        <a href="/tools" className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          See all {count} free tools <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </Rise>
    </div>
  )
}
