"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { DATA } from "@/data/resume"

/* ------------------------------------------------------------------
   Deterministic ridge generator — the same jagged skyline every render
   (no hydration mismatch), drawn in a 1440×400 box.
   ------------------------------------------------------------------ */
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Fractal ridgeline via 1-D midpoint displacement — looks like real mountains. */
function ridgePath({ seed, base, amp, rough, peaks = [] }: { seed: number; base: number; amp: number; rough: number; peaks?: [number, number][] }) {
  const r = rng(seed)
  const N = 256
  const h = new Array<number>(N + 1).fill(0)
  h[0] = r()
  h[N] = r()
  let step = N
  let scale = 1
  while (step > 1) {
    const half = step / 2
    for (let i = half; i < N; i += step) {
      h[i] = (h[i - half] + h[i + half]) / 2 + (r() - 0.5) * scale
    }
    step = half
    scale *= rough
  }
  // add a few deliberate summits so the skyline has character
  for (const [at, height] of peaks) {
    for (let i = 0; i <= N; i++) {
      const d = Math.abs(i / N - at)
      h[i] += Math.max(0, height * (1 - d * 7))
    }
  }
  const min = Math.min(...h)
  const max = Math.max(...h)
  const pts = h.map((v, i) => {
    const x = -20 + (i / N) * 1480
    const y = base - ((v - min) / (max - min)) * amp
    return `${x.toFixed(1)} ${y.toFixed(1)}`
  })
  return `M-20 400 L${pts.join(" L")} L1460 400 Z`
}

const FAR = ridgePath({ seed: 11, base: 270, amp: 200, rough: 0.56, peaks: [[0.3, 0.5], [0.7, 0.7]] })
const MID = ridgePath({ seed: 29, base: 350, amp: 200, rough: 0.58, peaks: [[0.5, 0.55], [0.18, 0.2], [0.82, 0.25]] })
const NEAR = ridgePath({ seed: 97, base: 385, amp: 120, rough: 0.48, peaks: [[0.15, 0.3], [0.8, 0.3]] })

function Ridge({
  d,
  fill,
  y,
  rim,
  className,
}: {
  d: string
  fill: string
  y: MotionValue<string>
  rim?: string
  className?: string
}) {
  // the solid block under the SVG keeps the layer opaque all the way down while it moves up
  return (
    <motion.div
      aria-hidden
      className={`absolute inset-x-[-80%] bottom-0 h-[56%] will-change-transform sm:inset-x-[-15%] sm:h-[70%] lg:inset-x-0 lg:h-[72%] ${className ?? ""}`}
      style={{ y }}
    >
      {/* stretched rather than cropped, so phones see the whole range, not one giant peak */}
      <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="h-full w-full">
        {rim && <path d={d} fill={rim} transform="translate(0 -2)" />}
        <path d={d} fill={fill} />
      </svg>
      <div className="absolute inset-x-0 top-[calc(100%-2px)] h-[120vh]" style={{ background: fill }} />
    </motion.div>
  )
}

function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      className={`absolute rounded-[50%] blur-3xl ${className ?? ""}`}
      style={{
        background: "radial-gradient(closest-side, var(--mist), transparent)",
        ...style,
      }}
    />
  )
}

export function SummitHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] })

  // each layer moves at its own speed — further away = slower
  const skyScale = useTransform(p, [0, 1], reduce ? [1, 1] : [1.18, 1])
  const skyY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["0%", "12%"])
  const farY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-10%"])
  const midY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["3%", "-22%"])
  const nearY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["6%", "-45%"])
  const titleY = useTransform(p, [0, 0.6], reduce ? ["0%", "0%"] : ["0%", "-60%"])
  const titleOpacity = useTransform(p, [0, 0.45, 0.6], [1, 1, reduce ? 1 : 0])
  const titleBlur = useTransform(p, [0.3, 0.6], reduce ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(8px)"])
  const cloudX = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "18%"])
  const cloudX2 = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["4%", "-22%"])
  const mistOpacity = useTransform(p, [0, 0.35, 0.8], [0.25, 0.55, 0])
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0])

  const first = DATA.name.split(" ")[0]
  const last = DATA.name.split(" ").slice(1).join(" ")

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative h-[170vh] sm:h-[185vh]"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* 1 · sky — a photo from one of my treks */}
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: skyScale, y: skyY }}>
          <picture>
            <source media="(max-width: 900px)" srcSet="/summit/hero-1280.webp" />
            <img
              src="/summit/hero-2400.webp"
              alt="Snowy summit above a sea of blue Himalayan ridges and white clouds, photographed by Dhruv"
              className="h-full w-full object-cover object-[50%_30%]"
              style={{ filter: "var(--photo-filter)" }}
              fetchPriority="high"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />
        </motion.div>

        {/* 2 · high clouds */}
        <motion.div className="absolute inset-0" style={{ x: cloudX }}>
          <div className="animate-drift-slow absolute inset-0">
            <Cloud className="left-[5%] top-[18%] h-24 w-[38%] opacity-60" />
            <Cloud className="right-[2%] top-[10%] h-20 w-[30%] opacity-50" />
          </div>
        </motion.div>

        {/* 3 · far ridge */}
        <Ridge d={FAR} fill="var(--ridge-far)" rim="var(--ridge-snow)" y={farY} />

        {/* 4 · the name — sits *behind* the nearer ridges */}
        <motion.div
          className="absolute inset-x-0 top-[26%] sm:top-[24%] z-0 px-6 text-center will-change-transform"
          style={{ y: titleY, opacity: titleOpacity, filter: titleBlur }}
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white/85 drop-shadow">
            Full-stack engineer · {DATA.location}
          </p>
          <h1
            id="hero-title"
            className="font-display text-[clamp(3.6rem,13vw,11rem)] leading-[0.85] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.25)]"
          >
            {first}
            <span className="block italic">{last}</span>
          </h1>
        </motion.div>

        {/* 5 · mid ridge */}
        <Ridge d={MID} fill="var(--ridge-mid)" rim="var(--ridge-snow)" y={midY} />

        {/* 6 · valley mist rolling across */}
        <motion.div className="absolute inset-x-0 bottom-[18%] h-[30%]" style={{ x: cloudX2, opacity: mistOpacity }}>
          <div className="animate-drift absolute inset-0">
            <Cloud className="left-[-10%] top-[20%] h-[70%] w-[60%]" />
            <Cloud className="right-[-10%] top-[35%] h-[60%] w-[55%]" />
          </div>
        </motion.div>

        {/* 7 · near snow ridge, painted in the page colour so the scene melts into the page */}
        <Ridge d={NEAR} fill="var(--background)" rim="var(--ridge-shade)" y={nearY} />

        {/* scroll cue */}
        <motion.a
          href="#about"
          style={{ opacity: cueOpacity }}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-foreground/70 hover:text-foreground"
        >
          Begin the climb
          <ArrowDown className="size-4 animate-bounce" aria-hidden />
        </motion.a>
      </div>
    </section>
  )
}
