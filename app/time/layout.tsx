import { toolMetadata } from "@/lib/tools"
import { ToolLayout } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("time")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayout slug="time" dark>{children}</ToolLayout>
}
