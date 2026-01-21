"use client"

import { useState } from "react"
import { EnhancedAdminDashboard } from "@/components/admin/enhanced-admin-dashboard"
import { PasswordGate } from "@/components/admin/password-gate"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="min-h-screen ">
      <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} isAuthenticated={isAuthenticated} />

      <div className={`${!isAuthenticated ? "blur-sm pointer-events-none" : ""} container mx-auto px-4 py-12 max-w-7xl transition-all duration-300`}>
        <EnhancedAdminDashboard />
      </div>
    </div>
  )
}
