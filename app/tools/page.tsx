import Link from "next/link"
import { CreditCard, Clock, ArrowLeftRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const metadata = {
  title: "Tools | Dhruv Agrawat",
  description: "A small collection of useful tools I built for everyday tasks.",
}

const tools = [
  {
    href: "/currency",
    icon: ArrowLeftRight,
    label: "Currency Converter",
    description:
      "Convert between currencies with live exchange rates. Add multiple pairs and track them side by side.",
  },
  {
    href: "/time",
    icon: Clock,
    label: "World Clock",
    description:
      "Track multiple time zones at once. Useful for scheduling across different countries.",
  },
  {
    href: "/payments",
    icon: CreditCard,
    label: "Payments",
    description:
      "Freelance payment info, quotations, and Wise transfer details for clients.",
  },
]

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Tools</h1>
      <p className="text-muted-foreground mb-10">
        A small collection of utilities I built for everyday use.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(({ href, icon: Icon, label, description }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/40 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">{label}</h2>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
