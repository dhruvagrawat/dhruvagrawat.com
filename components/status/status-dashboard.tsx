"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { CheckCircle2, XCircle, AlertCircle, Lock, RefreshCw, Eye, EyeOff, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// ── Types ────────────────────────────────────────────────────────────────────

type CheckStatus = "up" | "degraded" | "down"

interface HistoryEntry {
  status: CheckStatus
  response_time_ms: number | null
  status_code: number | null
  error_message?: string | null
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
  latest: HistoryEntry | null
  history: HistoryEntry[]
  uptimePct: number | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(s: CheckStatus | undefined) {
  if (s === "up") return "bg-emerald-500"
  if (s === "degraded") return "bg-amber-400"
  if (s === "down") return "bg-red-500"
  return "bg-muted"
}

// `undefined` means no check has run yet — shown as "Pending", never as "Down".
function statusLabel(s: CheckStatus | undefined) {
  if (s === "up") return "Operational"
  if (s === "degraded") return "Degraded"
  if (s === "down") return "Down"
  return "Pending"
}

function StatusIcon({ status, size = 18 }: { status: CheckStatus | undefined; size?: number }) {
  if (status === "up") return <CheckCircle2 size={size} className="text-emerald-500 shrink-0" />
  if (status === "degraded") return <AlertCircle size={size} className="text-amber-400 shrink-0" />
  if (status === "down") return <XCircle size={size} className="text-red-500 shrink-0" />
  return <Clock size={size} className="text-muted-foreground shrink-0" />
}

function badgeClass(s: CheckStatus | undefined) {
  if (s === "up") return "bg-emerald-500/10 text-emerald-500"
  if (s === "degraded") return "bg-amber-400/10 text-amber-500"
  if (s === "down") return "bg-red-500/10 text-red-500"
  return "bg-muted text-muted-foreground"
}

interface StatusResponse {
  services: Service[]
  privateCount: number
  privateUnlocked: boolean
  privateConfigured: boolean
  canCheck: boolean
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
        {entry.error_message && (
          <p className="mt-1 text-amber-400 wrap-break-word">{entry.error_message}</p>
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
    ...history.slice(-slots), // history is oldest → newest, so newest ends up on the right
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
            className={`text-xs px-2 py-0.5 border-0 ${badgeClass(svc.latest?.status)}`}
          >
            {statusLabel(svc.latest?.status)}
          </Badge>
        </div>
      </div>

      <HistoryBar history={svc.history} />

      {svc.latest && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            Last {Math.min(30, svc.history.length)} checks
          </span>
          <span className="text-xs text-muted-foreground">{timeAgo(svc.latest.checked_at)}</span>
        </div>
      )}
    </div>
  )
}

// ── Group section ────────────────────────────────────────────────────────────

function ServiceGroup({ name, services }: { name: string; services: Service[] }) {
  const checked = services.filter((s) => s.latest)
  const anyDown = checked.some((s) => s.latest?.status === "down")
  const anyDegraded = checked.some((s) => s.latest?.status === "degraded")
  const groupStatus: CheckStatus | undefined = !checked.length
    ? undefined
    : anyDown
    ? "down"
    : anyDegraded
    ? "degraded"
    : "up"

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">{name}</h2>
        <span
          className={`text-xs font-medium ${
            groupStatus === "up"
              ? "text-emerald-500"
              : groupStatus === "degraded"
              ? "text-amber-500"
              : groupStatus === "down"
              ? "text-red-500"
              : "text-muted-foreground"
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
// The password is checked on the server: private services are never sent to the
// browser until the right password is supplied.

function PrivateSection({
  services,
  count,
  configured,
  unlocked,
  onUnlock,
}: {
  services: Service[]
  count: number
  configured: boolean
  unlocked: boolean
  onUnlock: (pw: string) => Promise<boolean>
}) {
  const [input, setInput] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!configured && count === 0) return null

  async function attempt() {
    if (!input) return
    setBusy(true)
    const ok = await onUnlock(input)
    setBusy(false)
    if (!ok) {
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

      {unlocked ? (
        <div className="rounded-xl border bg-card px-4">
          {services.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground text-center">No private services added yet.</p>
          ) : (
            services.map((svc) => <ServiceRow key={svc.id} svc={svc} />)
          )}
        </div>
      ) : (
        <div className="rounded-xl border bg-card flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
          <Lock size={28} className="text-muted-foreground" />
          <p className="text-sm font-medium">
            {count > 0
              ? `${count} client service${count === 1 ? "" : "s"} hidden`
              : "Client services are hidden"}
          </p>
          {configured ? (
            <>
              <div className="flex gap-2 w-full max-w-xs">
                <div className="relative flex-1">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="Password"
                    aria-label="Password for client services"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && attempt()}
                    className={error ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <Button onClick={attempt} size="sm" disabled={busy}>
                  {busy ? "Checking…" : "Unlock"}
                </Button>
              </div>
              {error && <p className="text-xs text-red-500">Incorrect password</p>}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Set <code>STATUS_PRIVATE_PASSWORD</code> to enable this section.
            </p>
          )}
        </div>
      )}
    </section>
  )
}

// ── Overall banner ───────────────────────────────────────────────────────────

function OverallBanner({ services }: { services: Service[] }) {
  const publicServices = services.filter((s) => !s.is_private)
  const checked = publicServices.filter((s) => s.latest)
  const anyDown = checked.some((s) => s.latest?.status === "down")
  const anyDegraded = checked.some((s) => s.latest?.status === "degraded")
  const pending = checked.length === 0
  const allUp = !pending && !anyDown && !anyDegraded

  const tone = pending
    ? "bg-muted/40 border-border"
    : allUp
    ? "bg-emerald-500/5 border-emerald-500/20"
    : anyDown
    ? "bg-red-500/5 border-red-500/20"
    : "bg-amber-400/5 border-amber-400/20"
  const dot = pending ? "bg-muted-foreground" : allUp ? "bg-emerald-500" : anyDown ? "bg-red-500" : "bg-amber-400"
  const headline = pending
    ? "Waiting for the first checks"
    : allUp
    ? "All systems operational"
    : anyDown
    ? "Service disruption detected"
    : "Partial degradation"

  return (
    <div className={`rounded-2xl px-6 py-5 mb-10 flex items-center gap-4 border ${tone}`}>
      <span className="relative flex h-3 w-3 shrink-0">
        {allUp && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />}
        <span className={`relative inline-flex h-3 w-3 rounded-full ${dot}`} />
      </span>
      <div>
        <p className="font-semibold text-lg">{headline}</p>
        <p className="text-sm text-muted-foreground">
          {publicServices.length} service{publicServices.length !== 1 ? "s" : ""} monitored
        </p>
      </div>
    </div>
  )
}

// ── Main dashboard ───────────────────────────────────────────────────────────

const PW_KEY = "status_pw"

export function StatusDashboard() {
  const [data, setData] = useState<StatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const pwRef = useRef<string>("")

  const fetchServices = useCallback(async (password?: string) => {
    const pw = password ?? pwRef.current
    try {
      const res = await fetch("/api/status/services", {
        cache: "no-store",
        headers: pw ? { "x-status-password": pw } : undefined,
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json || !Array.isArray(json.services)) {
        setError(json?.error ?? `Couldn't load status (HTTP ${res.status}).`)
        return null
      }
      setData(json)
      setError(null)
      setLastRefresh(new Date())
      return json as StatusResponse
    } catch {
      setError("Couldn't reach the status service. Check your connection and try again.")
      return null
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    try {
      pwRef.current = sessionStorage.getItem(PW_KEY) ?? ""
    } catch {
      /* storage blocked */
    }
    fetchServices()
    const interval = setInterval(() => fetchServices(), 60_000) // refresh every 60s
    return () => clearInterval(interval)
  }, [fetchServices])

  // keep "Updated Xs ago" ticking
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 15_000)
    return () => clearInterval(t)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchServices()
  }

  const unlock = async (pw: string) => {
    const res = await fetchServices(pw)
    if (res?.privateUnlocked) {
      pwRef.current = pw
      try {
        sessionStorage.setItem(PW_KEY, pw)
      } catch {
        /* ignore */
      }
      return true
    }
    return false
  }

  const services = data?.services ?? []
  const publicServices = services.filter((s) => !s.is_private)
  const privateServices = services.filter((s) => s.is_private)

  const groups = publicServices.reduce<Record<string, Service[]>>((acc, svc) => {
    if (!acc[svc.group_name]) acc[svc.group_name] = []
    acc[svc.group_name].push(svc)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Status</h1>
          <p className="text-sm text-muted-foreground">
            {lastRefresh ? `Updated ${timeAgo(lastRefresh.toISOString())}` : loading ? "Fetching…" : ""}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="gap-2"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Checking services…</p>
        </div>
      )}

      {!loading && error && !data && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
          <XCircle className="mx-auto mb-3 text-red-500" size={28} />
          <p className="font-medium mb-1">Status is temporarily unavailable</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {data && (
        <>
          {publicServices.length > 0 && <OverallBanner services={services} />}

          {Object.entries(groups).map(([groupName, svcs]) => (
            <ServiceGroup key={groupName} name={groupName} services={svcs} />
          ))}

          {publicServices.length === 0 && (
            <div className="rounded-xl border bg-card px-6 py-12 text-center text-muted-foreground">
              <p className="font-medium mb-1">No services configured</p>
              <p className="text-sm">Add rows to the <code>status_services</code> table (see scripts/05-status-tables.sql).</p>
            </div>
          )}

          <PrivateSection
            services={privateServices}
            count={data.privateCount}
            configured={data.privateConfigured}
            unlocked={data.privateUnlocked}
            onUnlock={unlock}
          />

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Services are checked automatically every few minutes while this page is open.
          </p>
        </>
      )}
    </div>
  )
}
