import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("color-converter")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="color-converter">{children}</ToolShell>
}
