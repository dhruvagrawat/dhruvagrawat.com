"use client"

import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react"
import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo"
import { feature } from "topojson-client"
import type { FeatureCollection, Geometry } from "geojson"
import type { Topology } from "topojson-specification"
import type { Place } from "@/content/travel/places"

export interface GlobeHandle {
  flyTo: (p: Place) => void
}

type Rot = [number, number, number]

const HOME: [number, number] = [77.209, 28.6139] // New Delhi — arcs start here

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export const Globe = forwardRef<
  GlobeHandle,
  {
    places: Place[]
    selected?: string | null
    onSelect: (slug: string) => void
    className?: string
  }
>(function Globe({ places, selected, onSelect, className }, ref) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pinRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [land, setLand] = useState<FeatureCollection<Geometry, { name: string }> | null>(null)
  const [hover, setHover] = useState<string | null>(null)

  const rot = useRef<Rot>([-78, -22, 0]) // start over India
  const zoom = useRef(1)
  const targetZoom = useRef(1)
  const drag = useRef<{ x: number; y: number; r: Rot } | null>(null)
  const idleUntil = useRef(0)
  const fly = useRef<{ from: Rot; to: Rot; t0: number; dur: number } | null>(null)
  const size = useRef({ w: 600, h: 600, dpr: 1 })
  const reduce = useRef(false)

  /* ---------- data ---------- */
  useEffect(() => {
    let alive = true
    fetch("/travel/countries-110m.json")
      .then((r) => r.json())
      .then((topo: Topology) => {
        if (!alive) return
        const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>
        setLand(fc)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  /* ---------- fly to a place ---------- */
  const flyTo = useCallback((p: Place) => {
    const from = [...rot.current] as Rot
    // take the short way round
    let lambda = -p.lng
    while (lambda - from[0] > 180) lambda -= 360
    while (lambda - from[0] < -180) lambda += 360
    const to: Rot = [lambda, Math.max(-60, Math.min(60, -p.lat)), 0]
    fly.current = { from, to, t0: performance.now(), dur: reduce.current ? 1 : 1400 }
    targetZoom.current = 1.35
    idleUntil.current = performance.now() + 8000
  }, [])
  useImperativeHandle(ref, () => ({ flyTo }), [flyTo])

  /* ---------- render loop ---------- */
  useEffect(() => {
    const canvas = canvasRef.current!
    const wrap = wrapRef.current!
    const ctx = canvas.getContext("2d")!
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      const r = wrap.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      size.current = { w: r.width, h: r.height, dpr }
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    let colors = readColors()
    function readColors() {
      return {
        ocean: cssVar("--card") || "#fbf9f4",
        land: cssVar("--muted") || "#e9e4da",
        stroke: cssVar("--border") || "rgba(0,0,0,.12)",
        ink: cssVar("--foreground") || "#16181d",
        primary: cssVar("--primary") || "#1f5e96",
        gold: "oklch(0.75 0.14 75)",
      }
    }
    const mo = new MutationObserver(() => (colors = readColors()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    const projection = geoOrthographic().clipAngle(90).precision(0.4)
    const path = geoPath(projection, ctx)
    const graticule = geoGraticule10()
    const visitedCountries = new Set(places.filter((p) => p.status === "visited").map((p) => p.country))

    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      const { w, h, dpr } = size.current

      // motion: fly-to → auto-rotate when idle
      if (fly.current) {
        const f = fly.current
        const t = Math.min(1, (now - f.t0) / f.dur)
        const e = ease(t)
        rot.current = [f.from[0] + (f.to[0] - f.from[0]) * e, f.from[1] + (f.to[1] - f.from[1]) * e, 0]
        if (t >= 1) fly.current = null
      } else if (!drag.current && now > idleUntil.current && !reduce.current) {
        rot.current = [rot.current[0] + dt * 0.006, rot.current[1] + (-20 - rot.current[1]) * 0.002, 0]
        targetZoom.current = 1
      }
      zoom.current += (targetZoom.current - zoom.current) * 0.08

      const radius = (Math.min(w, h) / 2 - 8) * zoom.current
      projection.scale(radius).translate([w / 2, h / 2]).rotate(rot.current)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // sphere + soft glow
      const g = ctx.createRadialGradient(w / 2 - radius * 0.3, h / 2 - radius * 0.35, radius * 0.1, w / 2, h / 2, radius)
      g.addColorStop(0, colors.ocean)
      g.addColorStop(1, colors.land)
      ctx.beginPath()
      path({ type: "Sphere" } as GeoPermissibleObjects)
      ctx.fillStyle = g
      ctx.fill()

      ctx.beginPath()
      path(graticule)
      ctx.strokeStyle = colors.stroke
      ctx.lineWidth = 0.6
      ctx.stroke()

      if (land) {
        for (const f of land.features) {
          ctx.beginPath()
          path(f)
          const visited = visitedCountries.has(f.properties.name)
          ctx.fillStyle = visited ? colors.primary : colors.land
          ctx.globalAlpha = visited ? 0.28 : 1
          ctx.fill()
          ctx.globalAlpha = 1
          ctx.strokeStyle = colors.stroke
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
      }

      // arcs from home
      for (const p of places) {
        if (p.slug === "new-delhi") continue
        const interp = geoInterpolate(HOME, [p.lng, p.lat])
        ctx.beginPath()
        path({ type: "LineString", coordinates: Array.from({ length: 33 }, (_, i) => interp(i / 32)) } as GeoPermissibleObjects)
        ctx.setLineDash(p.status === "wishlist" ? [3, 4] : [])
        ctx.strokeStyle = p.status === "wishlist" ? colors.gold : colors.primary
        ctx.globalAlpha = p.slug === selected ? 0.95 : 0.45
        ctx.lineWidth = p.slug === selected ? 1.8 : 1.1
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }

      // rim
      ctx.beginPath()
      path({ type: "Sphere" } as GeoPermissibleObjects)
      ctx.strokeStyle = colors.ink
      ctx.globalAlpha = 0.35
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.globalAlpha = 1

      // pins: position DOM buttons, hide those on the far side
      const center: [number, number] = [-rot.current[0], -rot.current[1]]
      for (const p of places) {
        const el = pinRefs.current.get(p.slug)
        if (!el) continue
        const visible = geoDistance([p.lng, p.lat], center) < Math.PI / 2 - 0.05
        const xy = projection([p.lng, p.lat])
        if (!xy || !visible) {
          el.style.opacity = "0"
          el.style.pointerEvents = "none"
          el.tabIndex = -1
          continue
        }
        el.style.opacity = "1"
        el.style.pointerEvents = "auto"
        el.tabIndex = 0
        el.style.transform = `translate3d(${xy[0]}px, ${xy[1]}px, 0) translate(-50%, -50%)`
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
    }
  }, [land, places, selected])

  /* ---------- drag to spin ---------- */
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return
    drag.current = { x: e.clientX, y: e.clientY, r: [...rot.current] as Rot }
    fly.current = null
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const k = 0.35 / zoom.current
    rot.current = [d.r[0] + (e.clientX - d.x) * k, Math.max(-60, Math.min(60, d.r[1] - (e.clientY - d.y) * k)), 0]
  }
  const onPointerUp = () => {
    drag.current = null
    idleUntil.current = performance.now() + 4000
  }

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-square w-full touch-none select-none ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ cursor: drag.current ? "grabbing" : "grab" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />
      {!land && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">Loading the globe…</div>
      )}
      {places.map((p) => {
        const on = p.slug === selected
        const wish = p.status === "wishlist"
        return (
          <button
            key={p.slug}
            ref={(el) => {
              if (el) pinRefs.current.set(p.slug, el)
              else pinRefs.current.delete(p.slug)
            }}
            type="button"
            onClick={() => onSelect(p.slug)}
            onMouseEnter={() => setHover(p.slug)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(p.slug)}
            onBlur={() => setHover(null)}
            aria-label={`${p.name}, ${p.country} — ${wish ? "want to go" : "been there"}`}
            className="absolute left-0 top-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 focus-visible:outline-none"
            style={{ willChange: "transform" }}
          >
            <span className="relative flex size-7 items-center justify-center">
              {!wish && <span className="absolute inset-1 animate-ping rounded-full bg-primary/40" />}
              <span
                className={`relative block rounded-full border-2 transition-all duration-300 ${
                  wish ? "size-3.5 border-[oklch(0.75_0.14_75)] bg-background" : "size-3 border-background bg-primary"
                } ${on ? "scale-150 ring-4 ring-primary/25" : ""}`}
              />
            </span>
            {(hover === p.slug || on) && (
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full border bg-card/95 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur">
                {p.name}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
})
