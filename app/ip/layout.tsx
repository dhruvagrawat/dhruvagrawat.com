import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IP Info",
  description: "Your current IP address, ISP, location, and timezone — no account needed.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
