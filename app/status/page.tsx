import { Metadata } from "next"
import { StatusDashboard } from "@/components/status/status-dashboard"

export const metadata: Metadata = {
  title: "Status | Dhruv Agrawat",
  description: "Live uptime status for my websites, APIs, and services.",
}

export default function StatusPage() {
  return <StatusDashboard />
}
