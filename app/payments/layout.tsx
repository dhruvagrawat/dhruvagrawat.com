import { toolMetadata } from "@/lib/tools"
import { DarkPanel } from "@/components/tools/tool-seo"

// Kept out of search results on purpose: this page lists bank and UPI details.
export const metadata = toolMetadata("payments")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DarkPanel>{children}</DarkPanel>
}
