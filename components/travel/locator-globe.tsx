import { geoGraticule10, geoOrthographic, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import type { FeatureCollection, Geometry } from "geojson"
import type { Topology } from "topojson-specification"
import world from "world-atlas/countries-110m.json"

// Rendered on the server: a small static globe centred on the place, with a pin.
const land = feature(world as unknown as Topology, (world as unknown as Topology).objects.countries) as unknown as FeatureCollection<
  Geometry,
  { name: string }
>

export function LocatorGlobe({ lat, lng, country, label }: { lat: number; lng: number; country: string; label: string }) {
  const S = 240
  const projection = geoOrthographic()
    .scale(S / 2 - 4)
    .translate([S / 2, S / 2])
    .rotate([-lng, -lat])
    .clipAngle(90)
  const path = geoPath(projection)
  const [x, y] = projection([lng, lat]) ?? [S / 2, S / 2]

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full" role="img" aria-label={`Map: ${label} in ${country}`}>
      <defs>
        <radialGradient id="lg-sea" cx="35%" cy="30%">
          <stop offset="0%" stopColor="var(--card)" />
          <stop offset="100%" stopColor="var(--muted)" />
        </radialGradient>
      </defs>
      <path d={path({ type: "Sphere" }) ?? ""} fill="url(#lg-sea)" />
      <path d={path(geoGraticule10()) ?? ""} fill="none" stroke="var(--border)" strokeWidth={0.5} />
      {land.features.map((f, i) => (
        <path
          key={i}
          d={path(f) ?? ""}
          fill={f.properties.name === country ? "color-mix(in oklab, var(--primary) 30%, var(--muted))" : "var(--muted)"}
          stroke="var(--border)"
          strokeWidth={0.6}
        />
      ))}
      <path d={path({ type: "Sphere" }) ?? ""} fill="none" stroke="var(--foreground)" strokeOpacity={0.3} />
      <circle cx={x} cy={y} r={10} fill="var(--primary)" opacity={0.2} />
      <circle cx={x} cy={y} r={4.5} fill="var(--primary)" stroke="var(--background)" strokeWidth={2} />
    </svg>
  )
}
