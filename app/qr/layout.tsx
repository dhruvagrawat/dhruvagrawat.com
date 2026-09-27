import { toolMetadata } from "@/lib/tools"
import { ToolLayout } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("qr")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayout slug="qr">{children}</ToolLayout>
}
