import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("word-counter")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="word-counter">{children}</ToolShell>
}
