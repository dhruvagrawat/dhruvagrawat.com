import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Turn any URL or text into a downloadable QR code — instant, free, no account.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
