import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "Security, running an agency, and travelling India"

export default function Image() {
  return postOgImage({ kicker: "Articles", title: "Security, running an agency, and travelling India" })
}
