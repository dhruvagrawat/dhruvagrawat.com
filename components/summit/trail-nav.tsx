"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

export const CAMPS = [
  { id: "about", camp: "Base camp", label: "About" },
  { id: "work", camp: "Camp I", label: "Work" },
  { id: "trail", camp: "Camp II", label: "The trail" },
  { id: "projects", camp: "Camp III", label: "Projects" },
  { id: "notes", camp: "Field notes", label: "Writing" },
  { id: "skills", camp: "Camp IV", label: "Skills" },
  { id: "contact", camp: "Summit", label: "Contact" },
] as const

/**
 * Altitude-style progress trail pinned to the right edge (large screens):
 * a line that fills as you scroll, with a marker for each "camp".
 */
export function TrailNav() {
  const { scrollYProgress } = useScroll()
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const [active, setActive] = useState<string>("")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    CAMPS.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) obs.observe(el)
    })
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      obs.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-500 xl:block",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="relative flex flex-col gap-7 py-1 pr-1">
        <div className="absolute right-[5px] top-0 h-full w-px bg-border" aria-hidden />
        <motion.div
          aria-hidden
          className="absolute right-[5px] top-0 h-full w-px origin-top bg-primary"
          style={{ scaleY: fill }}
        />
        {CAMPS.map((c) => {
          const on = active === c.id
          return (
            <a key={c.id} href={`#${c.id}`} className="group relative flex items-center justify-end gap-3">
              <span
                className={cn(
                  "text-right font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300",
                  on ? "text-foreground opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                )}
              >
                {c.camp}
                <span className="block normal-case tracking-normal text-[11px] font-sans">{c.label}</span>
              </span>
              <span
                className={cn(
                  "relative z-10 block size-[11px] rotate-45 border transition-all duration-300",
                  on ? "scale-125 border-primary bg-primary" : "border-muted-foreground/50 bg-background group-hover:border-foreground"
                )}
              />
            </a>
          )
        })}
      </div>
    </nav>
  )
}
