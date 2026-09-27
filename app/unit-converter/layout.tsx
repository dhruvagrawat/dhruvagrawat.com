import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("unit-converter")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="unit-converter">{children}</ToolShell>
}
