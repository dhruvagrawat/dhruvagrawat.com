"use client"

import { useState, useEffect } from "react"
import { Globe, Wifi, MapPin, Clock, Building2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IpData {
  query: string
  city: string
  regionName: string
  country: string
  countryCode: string
  isp: string
  org: string
  timezone: string
  lat: number
  lon: number
  zip: string
}

function Field({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-medium text-sm">{value}</p>
        </div>
      </div>
      <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors p-1">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}

export default function IpPage() {
  const [data, setData] = useState<IpData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://ip-api.com/json/?fields=query,city,regionName,country,countryCode,isp,org,timezone,lat,lon,zip")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("Could not fetch IP info"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-bold mb-2">IP Info</h1>
      <p className="text-muted-foreground mb-8">Your current network information — no account needed.</p>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="rounded-2xl border bg-card px-5 py-2">
          <Field icon={Globe} label="IP Address" value={data.query} />
          <Field icon={MapPin} label="Location" value={`${data.city}, ${data.regionName}, ${data.country} (${data.countryCode})`} />
          <Field icon={MapPin} label="Postal Code" value={data.zip || "—"} />
          <Field icon={MapPin} label="Coordinates" value={`${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}`} />
          <Field icon={Building2} label="ISP" value={data.isp} />
          <Field icon={Wifi} label="Organisation" value={data.org || data.isp} />
          <Field icon={Clock} label="Timezone" value={data.timezone} />
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-6">Powered by ip-api.com · For personal use only</p>
    </div>
  )
}
