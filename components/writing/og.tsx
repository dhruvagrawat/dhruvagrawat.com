import { ImageResponse } from "next/og"
import { DATA } from "@/data/resume"

export const ogSize = { width: 1200, height: 630 }

/** Share card for posts and recipes: paper background, big title, byline. */
export function postOgImage({ kicker, title, footer }: { kicker: string; title: string; footer?: string }) {
  const size = title.length > 70 ? 60 : title.length > 45 ? 72 : 86
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(160deg, #f4f0e7 0%, #e9e2d3 100%)",
          color: "#16181d",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 5, textTransform: "uppercase", color: "#1f5e96" }}>{kicker}</div>
        <div style={{ display: "flex", fontSize: size, lineHeight: 1.05, fontWeight: 700, letterSpacing: -1.5, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#4a4f58" }}>
          <div style={{ display: "flex" }}>{DATA.name}</div>
          <div style={{ display: "flex" }}>{footer ?? "dhruvagrawat.com"}</div>
        </div>
      </div>
    ),
    ogSize
  )
}
