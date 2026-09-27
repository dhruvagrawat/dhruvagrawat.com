import { toolMetadata } from "@/lib/tools"
import { ToolLayout } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("ip")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayout slug="ip">{children}</ToolLayout>
}
