import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "More",
  description: "Tools, utilities, and services — weather, currency, QR codes, password generator, and more.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
