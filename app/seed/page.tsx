'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSeed = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      setMessage(data.message || data.error)
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Seed Supabase Database</h1>
        <p className="text-zinc-400 mb-6">Click the button to populate the database with dummy data for all content types.</p>
        <Button 
          onClick={handleSeed} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Seeding...' : 'Seed Database'}
        </Button>
        {message && (
          <div className={`mt-4 p-3 rounded text-sm ${message.includes('Error') ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
