"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CreditCard, Clock, ArrowLeftRight, Activity,
  CloudSun, QrCode, KeyRound, Globe2,
  ChevronDown,
} from "lucide-react"

interface Tool {
  href: string
  icon: React.ElementType
  label: string
  description: string
  badge?: string
}

const categories: { name: string; description: string; tools: Tool[] }[] = [
  {
    name: "Live Data",
    description: "Real-time information pulled from the internet",
    tools: [
      {
        href: "/weather",
        icon: CloudSun,
        label: "Weather",
        description: "Real-time weather for any city. Powered by Open-Meteo — always free.",
        badge: "Open-Meteo",
      },
      {
        href: "/currency",
        icon: ArrowLeftRight,
        label: "Currency Converter",
        description: "Convert between currencies with live exchange rates.",
      },
      {
        href: "/time",
        icon: Clock,
        label: "World Clock",
        description: "Track multiple time zones at once.",
      },
      {
        href: "/ip",
        icon: Globe2,
        label: "IP Info",
        description: "Your current IP address, ISP, location, and timezone.",
      },
    ],
  },
  {
    name: "Utilities",
    description: "Handy tools that run entirely in your browser — no server needed",
    tools: [
      {
        href: "/qr",
        icon: QrCode,
        label: "QR Code Generator",
        description: "Turn any URL or text into a QR code. Download as PNG.",
      },
      {
        href: "/password",
        icon: KeyRound,
        label: "Password Generator",
        description: "Cryptographically random passwords. Generated locally, never sent anywhere.",
        badge: "Client-only",
      },
    ],
  },
  {
    name: "Services",
    description: "My service info and monitoring",
    tools: [
      {
        href: "/status",
        icon: Activity,
        label: "Status",
        description: "Live uptime monitoring for my websites, APIs, and client services.",
      },
      {
        href: "/payments",
        icon: CreditCard,
        label: "Payments",
        description: "Freelance quotations, payment info, and Wise transfer details.",
      },
    ],
  },
]

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon
  return (
    <Link href={tool.href}>
      <div className="group flex items-start gap-4 rounded-xl border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all duration-150">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-sm">{tool.label}</span>
            {tool.badge && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {tool.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
        </div>
      </div>
    </Link>
  )
}

function Category({ cat, defaultOpen = false }: { cat: typeof categories[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mb-4 rounded-2xl border bg-card/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
      >
        <div className="text-left">
          <h2 className="font-semibold">{cat.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-xs text-muted-foreground">{cat.tools.length} tools</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-4">
          {cat.tools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MorePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">More</h1>
        <p className="text-muted-foreground text-lg">
          Tools, utilities, and services I&apos;ve built and use day-to-day.
        </p>
      </div>

      {categories.map((cat, i) => (
        <Category key={cat.name} cat={cat} defaultOpen={i === 0} />
      ))}
    </div>
  )
}
