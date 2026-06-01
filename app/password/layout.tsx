import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Password Generator",
  description: "Cryptographically random passwords generated entirely in your browser — never sent anywhere.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
