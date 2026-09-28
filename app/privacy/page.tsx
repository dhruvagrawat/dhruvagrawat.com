import type { Metadata } from "next"
import Link from "next/link"
import { DATA } from "@/data/resume"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How dhruvagrawat.com handles your data: Google Analytics usage statistics, what the free tools do (and don't) send anywhere, and how to contact me.",
  alternates: { canonical: "/privacy" },
}

const UPDATED = "2026-09-29"

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl py-6">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Legal</p>
      <h1 className="text-5xl leading-[0.95] sm:text-6xl">Privacy policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Last updated <time dateTime={UPDATED}>29 September 2026</time>
      </p>

      <div className="prose prose-lg mt-10 max-w-none text-foreground dark:prose-invert prose-headings:font-display prose-headings:font-normal prose-p:text-foreground/85 prose-li:text-foreground/85 prose-a:text-primary">
        <p>
          This is the personal website of {DATA.name}, based in {DATA.location}. I keep data collection to a minimum.
          This page explains exactly what happens when you visit.
        </p>

        <h2>Analytics</h2>
        <p>
          I use <strong>Google Analytics 4</strong> to understand which pages are read and how people find the site —
          things like page views, approximate location (country/city), device type and referring website. Google
          Analytics uses cookies to do this. I don&apos;t use it to identify you personally, and I don&apos;t run ads.
          You can block it with any content blocker or Google&apos;s{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">opt-out add-on</a>.
        </p>

        <h2>The free tools</h2>
        <p>
          Most tools — the JSON formatter, Base64, hash, UUID, password and QR generators, calculators, word counter,
          image compressor and others — run <strong>entirely in your browser</strong>. What you type or upload is not
          sent to my server.
        </p>
        <p>A few tools need to fetch live data:</p>
        <ul>
          <li><strong>What&apos;s my IP</strong> looks up your IP address on the server (via ip-api.com) to show you the result. It isn&apos;t stored.</li>
          <li><strong>Weather</strong> sends the city you search for to Open-Meteo.</li>
          <li><strong>Currency converter</strong> downloads exchange rates from open.er-api.com.</li>
        </ul>

        <h2>Contact and email</h2>
        <p>
          If you email me or use a &ldquo;sign the guestbook&rdquo; form (which opens your own email app), I receive
          whatever you choose to send and use it only to reply.
        </p>

        <h2>Hosting</h2>
        <p>
          The site is hosted on Vercel, which keeps standard server logs (such as IP address and browser) for security
          and reliability.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask me what information I hold about you, or ask me to delete it, by emailing{" "}
          <a href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a>. I&apos;ll respond within a reasonable time,
          in line with India&apos;s Digital Personal Data Protection Act.
        </p>

        <p>
          <Link href="/">← Back to the home page</Link>
        </p>
      </div>
    </article>
  )
}
