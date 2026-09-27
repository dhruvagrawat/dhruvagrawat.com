import { toolMetadata } from "@/lib/tools"
import { ToolLayout } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("weather")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayout slug="weather">{children}</ToolLayout>
}
