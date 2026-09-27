"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

/** Buttery smooth scrolling (Lenis) — only mounted on the home page. */
export function SmoothScroll() {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    // make in-page anchor links glide too
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null
      if (!a) return
      const el = document.querySelector(a.getAttribute("href")!)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -8, duration: 1.4 })
      history.replaceState(null, "", a.getAttribute("href"))
    }
    document.addEventListener("click", onClick)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("click", onClick)
      lenis.destroy()
    }
  }, [reduce])
  return null
}

/** Heading whose words slide up from behind a mask, one after another. */
export function WordsReveal({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  italicLast = false,
  id,
}: {
  text: string
  as?: "h2" | "h3" | "p"
  className?: string
  delay?: number
  italicLast?: boolean
  id?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const words = text.split(" ")
  return (
    <Tag ref={ref} id={id} className={cn("font-display", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className={cn("inline-block", italicLast && i === words.length - 1 && "italic")}
            initial={reduce ? false : { y: "110%", rotate: 4 }}
            animate={inView ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Block that rises into place as it enters the viewport. */
export function Rise({
  children,
  className,
  delay = 0,
  y = 36,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Image revealed like a curtain lifting, with a slow parallax drift inside its frame. */
export function CurtainImage({
  src,
  srcSmall,
  alt,
  className,
  imgClassName,
}: {
  src: string
  srcSmall?: string
  alt: string
  className?: string
  imgClassName?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"])
  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <motion.img
        src={src}
        srcSet={srcSmall ? `${srcSmall} 800w, ${src} 1600w` : undefined}
        sizes="(max-width: 768px) 90vw, 50vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn("h-[116%] w-full object-cover will-change-transform", imgClassName)}
        style={{ y, filter: "var(--photo-filter)" }}
      />
    </motion.div>
  )
}

/** Section kicker: "▲ Camp I — Work" */
export function Kicker({ camp, label }: { camp: string; label: string }) {
  return (
    <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
      <svg viewBox="0 0 12 10" className="size-3 text-primary" aria-hidden>
        <path d="M6 0 12 10H0z" fill="currentColor" />
      </svg>
      {camp}
      <span className="h-px w-8 bg-border" />
      {label}
    </p>
  )
}
