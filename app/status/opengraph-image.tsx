import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "Live uptime for my websites and services"

export default function Image() {
  return postOgImage({ kicker: "Status", title: "Live uptime for my websites and services" })
}
