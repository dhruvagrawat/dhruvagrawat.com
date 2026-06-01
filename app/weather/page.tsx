"use client"

import { useState } from "react"
import { Search, Wind, Droplets, Thermometer, Eye, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface WeatherData {
  city: string
  country: string
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  weatherCode: number
  description: string
  visibility: number
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Slight rain", 63: "Rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Slight showers", 81: "Showers", 82: "Heavy showers",
  85: "Slight snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Heavy thunderstorm w/ hail",
}

const WMO_EMOJI: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️", 77: "🌨️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  85: "🌨️", 86: "❄️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
}

export default function WeatherPage() {
  const [query, setQuery] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function search() {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      // Geocoding
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      )
      const geoData = await geoRes.json()
      if (!geoData.results?.length) { setError("City not found"); return }
      const { latitude, longitude, name, country } = geoData.results[0]

      // Weather
      const wRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,visibility&wind_speed_unit=kmh`
      )
      const wData = await wRes.json()
      const c = wData.current
      setWeather({
        city: name, country,
        temp: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        humidity: c.relative_humidity_2m,
        windSpeed: Math.round(c.wind_speed_10m),
        weatherCode: c.weather_code,
        description: WMO_DESCRIPTIONS[c.weather_code] ?? "Unknown",
        visibility: Math.round((c.visibility ?? 0) / 1000),
      })
    } catch {
      setError("Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const emoji = weather ? (WMO_EMOJI[weather.weatherCode] ?? "🌡️") : null

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <h1 className="text-3xl font-bold mb-2">Weather</h1>
      <p className="text-muted-foreground mb-8">Real-time weather via Open-Meteo — no API key, always free.</p>

      <div className="flex gap-2 mb-8">
        <Input
          placeholder="City name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <Button onClick={search} disabled={loading}>
          {loading ? <span className="animate-spin">⏳</span> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {weather && (
        <div className="rounded-2xl border bg-card p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{weather.city}, {weather.country}</span>
              </div>
              <p className="text-7xl font-bold tracking-tight">{weather.temp}°</p>
              <p className="text-muted-foreground mt-1">{weather.description}</p>
            </div>
            <span className="text-7xl">{emoji}</span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Thermometer, label: "Feels like", value: `${weather.feelsLike}°C` },
              { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
              { icon: Wind, label: "Wind", value: `${weather.windSpeed} km/h` },
              { icon: Eye, label: "Visibility", value: `${weather.visibility} km` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-muted/40 p-4 flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">Powered by Open-Meteo · Free & open source</p>
        </div>
      )}
    </div>
  )
}
