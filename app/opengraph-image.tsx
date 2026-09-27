import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { DATA } from "@/data/resume"

export const runtime = "nodejs"
export const alt = `${DATA.name} — Full-stack software engineer`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Social share card: one of my trek photos with the name over it.
export default async function OpenGraphImage() {
  const bg = await readFile(join(process.cwd(), "public/summit/og-bg.jpg"))
  const src = `data:image/jpeg;base64,${bg.toString("base64")}`
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
        <img src={src} width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} alt="" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(10,20,40,0.15) 0%, rgba(10,20,40,0.65) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, color: "white", width: "100%" }}>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", opacity: 0.85 }}>
            {`Full-stack engineer · ${DATA.location}`}
          </div>
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1, marginTop: 12, letterSpacing: -2 }}>{DATA.name}</div>
          <div style={{ fontSize: 32, marginTop: 20, opacity: 0.9, maxWidth: 900 }}>{DATA.description}</div>
        </div>
      </div>
    ),
    size
  )
}
