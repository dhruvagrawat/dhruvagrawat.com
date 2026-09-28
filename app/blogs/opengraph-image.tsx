import { ogSize, postOgImage } from "@/components/writing/og"

export const size = ogSize
export const contentType = "image/png"
export const alt = "Notes from the terminal: Linux, Arch, open source and dev tools"

export default function Image() {
  return postOgImage({ kicker: "Blog", title: "Notes from the terminal: Linux, Arch, open source and dev tools" })
}
