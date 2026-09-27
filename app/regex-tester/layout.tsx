import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("regex-tester")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="regex-tester">{children}</ToolShell>
}
