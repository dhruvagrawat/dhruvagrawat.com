"use client"

import { useState } from "react"
import { AdminTabs } from "@/components/admin/admin-tabs"
import { PasswordGate } from "@/components/admin/password-gate"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} isAuthenticated={isAuthenticated} />

      <div className={isAuthenticated ? "" : "blur-content"}>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminTabs />
      </div>
    </div>
  )
}
