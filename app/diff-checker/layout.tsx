import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("diff-checker")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="diff-checker">{children}</ToolShell>
}
