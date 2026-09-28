import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "Authentic Italian pasta and North Indian classics"

export default function Image() {
  return postOgImage({ kicker: "Recipes", title: "Authentic Italian pasta and North Indian classics" })
}
