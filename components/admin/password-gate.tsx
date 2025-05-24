"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface PasswordGateProps {
  onAuthenticated: () => void
  isAuthenticated: boolean
}

export function PasswordGate({ onAuthenticated, isAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      if (password === "dhruvagrawat.com") {
        onAuthenticated()
      } else {
        setError("Incorrect password")
      }
      setIsLoading(false)
    }, 1000)
  }

  if (isAuthenticated) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-md border border-zinc-800">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-zinc-800 p-3 rounded-full">
            <Lock className="h-6 w-6 text-zinc-300" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center mb-6">Admin Access</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Unlock Admin Panel"}
          </Button>
        </form>
      </div>
    </div>
  )
}
