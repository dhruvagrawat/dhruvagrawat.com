"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { Check, Link2 } from "lucide-react"

/** Thin bar across the top of the page that fills as you read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-primary" style={{ scaleX: x }} />
}

/** Sticky table of contents that highlights the section you're reading. */
export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )
    items.forEach((i) => {
      const el = document.getElementById(i.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [items])
  if (items.length < 2) return null
  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">On this page</p>
      <ol className="space-y-1 border-l">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={`-ml-px block border-l-2 py-1 pl-3 leading-snug transition-colors ${
                active === i.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function CopyLink() {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href)
          setOk(true)
          setTimeout(() => setOk(false), 1500)
        } catch {
          /* ignore */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {ok ? <Check className="size-3.5 text-emerald-500" /> : <Link2 className="size-3.5" />}
      {ok ? "Copied" : "Copy link"}
    </button>
  )
}
