import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "About Dhruv Agrawat, full-stack software engineer in New Delhi"

export default function Image() {
  return postOgImage({ kicker: "About", title: "Dhruv Agrawat — full-stack engineer, freelancer and agency co-founder" })
}
