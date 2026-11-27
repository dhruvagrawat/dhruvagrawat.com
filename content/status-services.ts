/* ── Services shown on /status ────────────────────────────────────────────────
   When Supabase is connected, the list in the `status_services` table is used
   (and every check is stored, which gives the history bars and uptime %).

   This file is the BACKUP list: if Supabase isn't configured or can't be
   reached, /status checks these sites live instead, so the page never breaks.
   Keep it in sync with the public rows in the database. Private/client
   services belong only in the database (behind the password).
   ──────────────────────────────────────────────────────────────────────────── */
export type FallbackService = { name: string; url: string; group: string; description?: string; type?: "website" | "api" | "server" }

export const fallbackServices: FallbackService[] = [
  { name: "dhruvagrawat.com", url: "https://dhruvagrawat.com", group: "Personal", description: "Main portfolio site" },
  { name: "www.dhruvagrawat.com", url: "https://www.dhruvagrawat.com", group: "Personal" },
  { name: "convert.dhruvagrawat.com", url: "https://convert.dhruvagrawat.com", group: "Personal Tools" },
  { name: "cook.dhruvagrawat.com", url: "https://cook.dhruvagrawat.com", group: "Personal Tools" },
  { name: "love.dhruvagrawat.com", url: "https://love.dhruvagrawat.com", group: "Personal Tools" },
  { name: "virus-checker.dhruvagrawat.com", url: "https://virus-checker.dhruvagrawat.com", group: "Personal Tools" },
  { name: "quadcydle.com", url: "https://quadcydle.com", group: "Quadcydle" },
  { name: "www.quadcydle.com", url: "https://www.quadcydle.com", group: "Quadcydle" },
  { name: "app.applyo.app", url: "https://app.applyo.app", group: "Applyo", description: "Applyo App" },
  { name: "www.applyo.app", url: "https://www.applyo.app", group: "Applyo" },
]
