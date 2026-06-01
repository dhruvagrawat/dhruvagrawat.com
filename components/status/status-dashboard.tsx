"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { CheckCircle2, XCircle, AlertCircle, Lock, RefreshCw, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// ── Types ────────────────────────────────────────────────────────────────────

type CheckStatus = "up" | "degraded" | "down"

interface HistoryEntry {
  status: CheckStatus
  response_time_ms: number | null
  status_code: number | null
  checked_at: string
}

interface Service {
  id: string
  name: string
  url: string
  group_name: string
  description: string | null
  is_private: boolean
  type: string
  latest: {
    status: CheckStatus
    response_time_ms: number | null
    status_code: number | null
    checked_at: string
  } | null
  history: HistoryEntry[]
  uptimePct: number | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(s: CheckStatus | undefined) {
  if (s === "up") return "bg-emerald-500"
  if (s === "degraded") return "bg-amber-400"
  return "bg-red-500"
}

function statusLabel(s: CheckStatus | undefined) {
  if (s === "up") return "Operational"
  if (s === "degraded") return "Degraded"
  return "Down"
}

function StatusIcon({ status, size = 18 }: { status: CheckStatus | undefined; size?: number }) {
  if (status === "up") return <CheckCircle2 size={size} className="text-emerald-500 shrink-0" />
  if (status === "degraded") return <AlertCircle size={size} className="text-amber-400 shrink-0" />
  return <XCircle size={size} className="text-red-500 shrink-0" />
}

interface TooltipState {
  entry: HistoryEntry
  anchorRect: DOMRect
}

function BarTooltip({ state }: { state: TooltipState }) {
  const { entry, anchorRect } = state
  const ref = useRef<HTMLDivElement>(null)

  // Position above the bar, centred
  const style: React.CSSProperties = {
    position: "fixed",
    left: anchorRect.left + anchorRect.width / 2,
    top: anchorRect.top - 8,
    transform: "translate(-50%, -100%)",
    zIndex: 50,
    pointerEvents: "none",
  }

  const dt = new Date(entry.checked_at)
  const localDate = dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  const localTime = dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })

  const statusText = entry.status === "up" ? "Operational" : entry.status === "degraded" ? "Degraded" : "Down"
  const statusCls = entry.status === "up" ? "text-emerald-400" : entry.status === "degraded" ? "text-amber-400" : "text-red-400"

  return (
    <div ref={ref} style={style}>
      <div className="rounded-lg border bg-popover text-popover-foreground shadow-lg px-3 py-2 text-xs w-max max-w-56">
        <p className={`font-semibold mb-1 ${statusCls}`}>{statusText}</p>
        <p className="text-muted-foreground">{localDate} · {localTime}</p>
        {entry.response_time_ms != null && (
          <p className="text-muted-foreground">{entry.response_time_ms}ms
            {entry.status_code ? <span className="ml-1 opacity-60">· HTTP {entry.status_code}</span> : null}
          </p>
        )}
        {(entry as any).error_message && (
          <p className="mt-1 text-amber-400 wrap-break-word">{(entry as any).error_message}</p>
        )}
      </div>
      {/* arrow */}
      <div className="mx-auto w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-border" />
    </div>
  )
}

function HistoryBar({ history }: { history: HistoryEntry[] }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const slots = 30
  const padded: (HistoryEntry | null)[] = [
    ...Array(Math.max(0, slots - history.length)).fill(null),
    ...history.slice(0, slots),
  ]

  return (
    <div className="relative">
      <div className="flex gap-0.5 items-stretch h-4.5">
        {padded.map((entry, i) => (
          <div
            key={i}
            onMouseEnter={(e) => {
              if (entry) setTooltip({ entry, anchorRect: (e.currentTarget as HTMLElement).getBoundingClientRect() })
            }}
            onMouseLeave={() => setTooltip(null)}
            className={`flex-1 rounded-[2px] transition-opacity cursor-default ${
              entry
                ? `${statusColor(entry.status)} hover:opacity-75`
                : "bg-muted/40"
            }`}
          />
        ))}
      </div>
      {tooltip && <BarTooltip state={tooltip} />}
    </div>
  )
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ── Service row ──────────────────────────────────────────────────────────────

function ServiceRow({ svc }: { svc: Service }) {
  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusIcon status={svc.latest?.status} />
          <div className="min-w-0">
            <a
              href={svc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sm hover:underline truncate block"
            >
              {svc.name}
            </a>
            {svc.description && (
              <p className="text-xs text-muted-foreground truncate">{svc.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-right">
          {svc.latest?.response_time_ms != null && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {svc.latest.response_time_ms}ms
            </span>
          )}
          {svc.uptimePct != null && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {svc.uptimePct}% up
            </span>
          )}
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0.5 border-0 ${
              svc.latest?.status === "up"
                ? "bg-emerald-500/10 text-emerald-500"
                : svc.latest?.status === "degraded"
                ? "bg-amber-400/10 text-amber-400"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {statusLabel(svc.latest?.status)}
          </Badge>
        </div>
      </div>

      <HistoryBar history={svc.history} />

      {svc.latest && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">30 checks</span>
          <span className="text-xs text-muted-foreground">{timeAgo(svc.latest.checked_at)}</span>
        </div>
      )}
    </div>
  )
}

// ── Group section ────────────────────────────────────────────────────────────

function ServiceGroup({ name, services }: { name: string; services: Service[] }) {
  const allUp = services.every((s) => s.latest?.status === "up")
  const anyDown = services.some((s) => s.latest?.status === "down")
  const groupStatus: CheckStatus = anyDown ? "down" : allUp ? "up" : "degraded"

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">{name}</h2>
        <span
          className={`text-xs font-medium ${
            groupStatus === "up"
              ? "text-emerald-500"
              : groupStatus === "degraded"
              ? "text-amber-400"
              : "text-red-500"
          }`}
        >
          {statusLabel(groupStatus)}
        </span>
      </div>
      <div className="rounded-xl border bg-card px-4">
        {services.map((svc) => (
          <ServiceRow key={svc.id} svc={svc} />
        ))}
      </div>
    </section>
  )
}

// ── Private section ──────────────────────────────────────────────────────────

function PrivateSection({ services }: { services: Service[] }) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(false)

  // Restore from sessionStorage so refresh doesn't lock again
  useEffect(() => {
    setUnlocked(sessionStorage.getItem("status_unlocked") === "1")
  }, [])

  function attempt() {
    const pw = process.env.NEXT_PUBLIC_STATUS_PRIVATE_PASSWORD
    if (!pw || input === pw) {
      setUnlocked(true)
      sessionStorage.setItem("status_unlocked", "1")
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <section className="mb-8 mt-12">
      <div className="flex items-center gap-2 mb-3">
        <Lock size={16} className="text-muted-foreground" />
        <h2 className="text-base font-semibold">Client Services</h2>
        <Badge variant="secondary" className="text-xs">Private</Badge>
      </div>

      <div className="relative rounded-xl border bg-card overflow-hidden">
        {/* Always render the rows — blur them when locked */}
        <div className={`px-4 transition-all duration-300 ${unlocked ? "" : "blur-sm select-none pointer-events-none"}`}>
          {services.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground text-center">No private services added yet.</p>
          ) : (
            services.map((svc) => <ServiceRow key={svc.id} svc={svc} />)
          )}
        </div>

        {/* Password overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-sm">
            <Lock size={28} className="text-muted-foreground" />
            <p className="text-sm font-medium">Enter password to view client services</p>
            <div className="flex gap-2 w-full max-w-xs">
              <div className="relative flex-1">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && attempt()}
                  className={error ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <Button onClick={attempt} size="sm">Unlock</Button>
            </div>
            {error && <p className="text-xs text-red-500">Incorrect password</p>}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Overall banner ───────────────────────────────────────────────────────────

function OverallBanner({ services }: { services: Service[] }) {
  const publicServices = services.filter((s) => !s.is_private)
  const anyDown = publicServices.some((s) => s.latest?.status === "down")
  const anyDegraded = publicServices.some((s) => s.latest?.status === "degraded")
  const allUp = !anyDown && !anyDegraded

  return (
    <div
      className={`rounded-2xl px-6 py-5 mb-10 flex items-center gap-4 border ${
        allUp
          ? "bg-emerald-500/5 border-emerald-500/20"
          : anyDown
          ? "bg-red-500/5 border-red-500/20"
          : "bg-amber-400/5 border-amber-400/20"
      }`}
    >
      <div
        className={`h-3 w-3 rounded-full shrink-0 ${
          allUp ? "bg-emerald-500" : anyDown ? "bg-red-500" : "bg-amber-400"
        }`}
      />
      <div>
        <p className="font-semibold text-lg">
          {allUp ? "All systems operational" : anyDown ? "Service disruption detected" : "Partial degradation"}
        </p>
        <p className="text-sm text-muted-foreground">
          {publicServices.length} service{publicServices.length !== 1 ? "s" : ""} monitored
        </p>
      </div>
    </div>
  )
}

// ── Main dashboard ───────────────────────────────────────────────────────────

export function StatusDashboard() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/status/services")
      if (res.ok) {
        const data = await res.json()
        setServices(data)
        setLastRefresh(new Date())
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
    const interval = setInterval(fetchServices, 60_000) // refresh every 60s
    return () => clearInterval(interval)
  }, [fetchServices])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchServices()
  }

  // Group services
  const publicServices = services.filter((s) => !s.is_private)
  const privateServices = services.filter((s) => s.is_private)

  const groups = publicServices.reduce<Record<string, Service[]>>((acc, svc) => {
    if (!acc[svc.group_name]) acc[svc.group_name] = []
    acc[svc.group_name].push(svc)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Fetching service status…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Status</h1>
          <p className="text-sm text-muted-foreground">
            {lastRefresh ? `Updated ${timeAgo(lastRefresh.toISOString())}` : "Fetching…"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Overall banner */}
      {services.length > 0 && <OverallBanner services={services} />}

      {/* Public groups */}
      {Object.entries(groups).map(([groupName, svcs]) => (
        <ServiceGroup key={groupName} name={groupName} services={svcs} />
      ))}

      {services.length === 0 && (
        <div className="rounded-xl border bg-card px-6 py-12 text-center text-muted-foreground">
          <p className="font-medium mb-1">No services configured</p>
          <p className="text-sm">Add services in Supabase using the SQL from scripts/05-status-tables.sql</p>
        </div>
      )}

      {/* Private section — always shown */}
      <PrivateSection services={privateServices} />
    </div>
  )
}
