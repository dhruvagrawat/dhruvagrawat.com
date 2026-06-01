import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Weather",
  description: "Real-time weather for any city — powered by Open-Meteo, always free, no API key.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
