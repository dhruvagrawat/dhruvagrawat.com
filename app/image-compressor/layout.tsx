import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tools/tool-seo"

export const metadata = toolMetadata("image-compressor")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell slug="image-compressor">{children}</ToolShell>
}
