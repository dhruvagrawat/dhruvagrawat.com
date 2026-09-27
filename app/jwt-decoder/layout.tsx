import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("jwt-decoder")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="jwt-decoder">{children}</ToolShell>
}
