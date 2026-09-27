import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("base64")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="base64">{children}</ToolShell>
}
