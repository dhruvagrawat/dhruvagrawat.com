import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("uuid-generator")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="uuid-generator">{children}</ToolShell>
}
