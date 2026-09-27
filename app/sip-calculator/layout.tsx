import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("sip-calculator")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="sip-calculator">{children}</ToolShell>
}
