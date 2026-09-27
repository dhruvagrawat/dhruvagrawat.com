import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("json-formatter")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="json-formatter">{children}</ToolShell>
}
