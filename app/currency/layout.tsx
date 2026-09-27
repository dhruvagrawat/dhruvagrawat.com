import { toolMetadata } from "@/lib/tools"
import { ToolLayout } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("currency")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayout slug="currency" dark>{children}</ToolLayout>
}
