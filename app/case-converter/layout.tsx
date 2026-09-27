import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("case-converter")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="case-converter">{children}</ToolShell>
}
