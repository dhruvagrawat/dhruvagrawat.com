import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("gst-calculator")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="gst-calculator">{children}</ToolShell>
}
