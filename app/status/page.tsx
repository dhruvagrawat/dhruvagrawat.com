import { Metadata } from "next"
import { StatusDashboard } from "@/components/status/status-dashboard"

export const metadata: Metadata = {
  title: "Status — Live Uptime Monitor",
  description:
    "Live uptime and response times for Dhruv Agrawat's websites, APIs and services, with 90-check history.",
  alternates: { canonical: "/status" },
  openGraph: { url: "/status", title: "Status — Live Uptime Monitor" },
}

export default function StatusPage() {
  return <StatusDashboard />
}
