import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "Places I have been, and places I am going"

export default function Image() {
  return postOgImage({ kicker: "Travel journal", title: "Places I have been, and places I am going" })
}
