import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("emi-calculator")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="emi-calculator">{children}</ToolShell>
}
