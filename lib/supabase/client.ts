// This file should not be imported on the client side
// Use API routes instead for client-side data fetching
// This is kept for potential future server-side usage

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if we're in a non-browser environment
export const getSupabaseClient = () => {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseClient should not be called in the browser. Use API routes instead.")
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
