import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("hash-generator")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="hash-generator">{children}</ToolShell>
}
