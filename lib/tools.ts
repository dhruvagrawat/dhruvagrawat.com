import type { Metadata } from "next"
import {
  Activity,
  ArrowLeftRight,
  Binary,
  Braces,
  Clock,
  CloudSun,
  CreditCard,
  Fingerprint,
  Globe2,
  Hash,
  KeyRound,
  Palette,
  QrCode,
  Timer,
  Type,
  type LucideIcon,
} from "lucide-react"
import { DATA } from "@/data/resume"

/* =========================================================
   Single source of truth for every tool on the site.
   Drives: the /tools hub, page <title>/description/canonical,
   JSON-LD, the FAQ + "related tools" blocks, and the sitemap.
   ========================================================= */

export type ToolCategory = "Live Data" | "Developer" | "Utilities" | "Services"

export interface ToolDef {
  slug: string
  /** short name used in cards and breadcrumbs */
  label: string
  /** SEO <title> (the site name is appended by the root layout template) */
  title: string
  /** meta description — aim for 140–160 chars */
  description: string
  /** one-liner for the /tools hub card */
  blurb: string
  keywords: string[]
  category: ToolCategory
  icon: LucideIcon
  badge?: string
  isNew?: boolean
  /** noindex pages still show in the hub but are kept out of search/sitemap */
  noindex?: boolean
  faq: { q: string; a: string }[]
}

export const CATEGORY_INFO: Record<ToolCategory, string> = {
  "Live Data": "Real-time information pulled from the internet",
  Developer: "Everyday developer utilities — everything runs in your browser",
  Utilities: "Handy tools that run entirely in your browser — no server needed",
  Services: "My service info and monitoring",
}

export const CATEGORY_ORDER: ToolCategory[] = ["Live Data", "Developer", "Utilities", "Services"]

export const TOOLS: ToolDef[] = [
  /* ---------------- Live data ---------------- */
  {
    slug: "weather",
    label: "Weather",
    title: "Weather Now — Live Weather for Any City",
    description:
      "Check the current temperature, feels-like, humidity, wind and visibility for any city in the world. Free, fast and ad-free — powered by Open-Meteo.",
    blurb: "Real-time weather for any city. Powered by Open-Meteo — always free.",
    keywords: ["weather", "weather today", "current weather", "temperature", "weather by city"],
    category: "Live Data",
    icon: CloudSun,
    badge: "Open-Meteo",
    faq: [
      { q: "Where does the weather data come from?", a: "From Open-Meteo, an open-source weather API that combines national weather services. No account or API key is needed." },
      { q: "How often is it updated?", a: "Current conditions are refreshed every 15 minutes at the source. Search again to get the latest reading." },
      { q: "Is my location tracked?", a: "No. You type a city name; nothing about you is stored." },
    ],
  },
  {
    slug: "currency",
    label: "Currency Converter",
    title: "Currency Converter — Live Exchange Rates (USD, INR, EUR & more)",
    description:
      "Convert between 150+ currencies with daily exchange rates. Compare up to three pairs side by side — USD to INR, EUR to USD, GBP to INR and more.",
    blurb: "Convert between currencies with live exchange rates.",
    keywords: ["currency converter", "usd to inr", "exchange rate", "eur to usd", "gbp to inr", "money converter"],
    category: "Live Data",
    icon: ArrowLeftRight,
    faq: [
      { q: "How current are the exchange rates?", a: "Rates come from open.er-api.com and are updated once a day. They're mid-market rates — banks and card providers usually add a margin." },
      { q: "How many currencies are supported?", a: "More than 150, including USD, EUR, GBP, INR, AED, JPY, AUD, CAD and SGD." },
      { q: "Can I compare several currencies at once?", a: "Yes — add up to three currency pairs and they all update as you type the amount." },
    ],
  },
  {
    slug: "time",
    label: "World Clock",
    title: "World Clock — Current Time in Multiple Time Zones",
    description:
      "See the current time across cities and time zones at a glance. Compare IST, PST, EST, GMT and more — handy for scheduling calls with remote teams.",
    blurb: "Track multiple time zones at once.",
    keywords: ["world clock", "time zones", "current time", "ist to pst", "time converter", "meeting planner"],
    category: "Live Data",
    icon: Clock,
    faq: [
      { q: "Does it handle daylight saving time?", a: "Yes. Times are calculated by your browser using the official IANA time zone database, so DST changes are applied automatically." },
      { q: "Is the time accurate?", a: "It uses your device clock, which is normally synced to an internet time server." },
    ],
  },
  {
    slug: "ip",
    label: "IP Info",
    title: "What's My IP Address? — IP, ISP & Location Lookup",
    description:
      "Instantly see your public IP address, internet provider (ISP), approximate location and time zone. Free IP lookup with one-click copy.",
    blurb: "Your current IP address, ISP, location, and timezone.",
    keywords: ["what is my ip", "my ip address", "ip lookup", "isp lookup", "ip location"],
    category: "Live Data",
    icon: Globe2,
    faq: [
      { q: "What is a public IP address?", a: "It's the address the rest of the internet sees when you connect — usually assigned by your ISP to your router, and shared by every device on your network." },
      { q: "How accurate is the location?", a: "IP location is approximate — usually the right city or region, but it can point to your ISP's nearest hub instead of your exact address." },
      { q: "Is my IP stored?", a: "No. It's looked up once to show you the result and isn't logged." },
    ],
  },

  /* ---------------- Developer ---------------- */
  {
    slug: "json-formatter",
    label: "JSON Formatter",
    title: "JSON Formatter & Validator — Beautify, Minify and Check JSON",
    description:
      "Paste JSON to format, beautify, minify or validate it instantly, with the exact line and column of any error. Runs entirely in your browser — nothing is uploaded.",
    blurb: "Beautify, minify and validate JSON with clear error messages.",
    keywords: ["json formatter", "json validator", "json beautifier", "format json online", "minify json", "json lint"],
    category: "Developer",
    icon: Braces,
    isNew: true,
    faq: [
      { q: "Is my JSON sent to a server?", a: "No. Formatting and validation happen in your browser with JavaScript's built-in JSON parser, so private data never leaves your device." },
      { q: "What does 'minify' do?", a: "It removes all whitespace and line breaks, producing the smallest valid JSON — useful for payloads and config values." },
      { q: "Why is my JSON invalid?", a: "The most common causes are trailing commas, single quotes instead of double quotes, and unquoted keys. The error message points to the line and column." },
    ],
  },
  {
    slug: "base64",
    label: "Base64 Encoder / Decoder",
    title: "Base64 Encode & Decode Online — Text and Files",
    description:
      "Encode text to Base64 or decode Base64 back to text, with full UTF-8 and URL-safe support. Also converts files to Base64 data URLs. Free and private.",
    blurb: "Encode and decode Base64 (UTF-8, URL-safe, files).",
    keywords: ["base64 encode", "base64 decode", "base64 converter", "base64 to text", "image to base64", "url safe base64"],
    category: "Developer",
    icon: Binary,
    isNew: true,
    faq: [
      { q: "What is Base64?", a: "Base64 represents binary data using 64 printable characters, so it can travel safely through text-only systems like JSON, email or URLs." },
      { q: "What's URL-safe Base64?", a: "A variant that swaps + and / for - and _ and drops the = padding, so the result can be used in URLs and filenames without escaping." },
      { q: "Does it support emoji and non-English text?", a: "Yes. Text is encoded as UTF-8 first, so any character works." },
    ],
  },
  {
    slug: "uuid-generator",
    label: "UUID Generator",
    title: "UUID Generator — Random v4 UUIDs / GUIDs in Bulk",
    description:
      "Generate cryptographically secure random UUID v4 (GUID) values — one or up to 500 at a time, in upper or lower case, with or without hyphens. Copy all in one click.",
    blurb: "Generate random v4 UUIDs / GUIDs in bulk.",
    keywords: ["uuid generator", "guid generator", "uuid v4", "random uuid", "generate uuid online"],
    category: "Developer",
    icon: Fingerprint,
    isNew: true,
    faq: [
      { q: "Are these UUIDs unique?", a: "They're version 4 UUIDs built from 122 random bits using your browser's secure random generator. The chance of a collision is astronomically small." },
      { q: "What's the difference between a UUID and a GUID?", a: "Nothing practical — GUID is Microsoft's name for the same 128-bit identifier format." },
    ],
  },
  {
    slug: "timestamp",
    label: "Unix Timestamp Converter",
    title: "Unix Timestamp Converter — Epoch to Date and Back",
    description:
      "Convert Unix epoch timestamps (seconds or milliseconds) to human-readable dates in UTC and your local time zone, and turn any date back into a timestamp. Live current epoch clock.",
    blurb: "Convert epoch timestamps to dates and back.",
    keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "date to timestamp", "current epoch time"],
    category: "Developer",
    icon: Timer,
    isNew: true,
    faq: [
      { q: "What is a Unix timestamp?", a: "The number of seconds since 00:00:00 UTC on 1 January 1970 (the Unix epoch). It's time-zone independent, which makes it ideal for storing dates." },
      { q: "Seconds or milliseconds?", a: "Unix tools usually use seconds (10 digits today); JavaScript's Date.now() uses milliseconds (13 digits). The converter detects which one you pasted." },
      { q: "What is the year 2038 problem?", a: "Systems that store timestamps as signed 32-bit integers overflow on 19 January 2038. Modern 64-bit systems aren't affected." },
    ],
  },
  {
    slug: "hash-generator",
    label: "Hash Generator",
    title: "SHA-256 Hash Generator — SHA-1, SHA-384, SHA-512 Online",
    description:
      "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text or file instantly using the Web Crypto API. Nothing is uploaded — hashing happens on your device.",
    blurb: "SHA-1 / SHA-256 / SHA-512 hashes of text or files.",
    keywords: ["sha256 generator", "hash generator", "sha512 online", "sha1 hash", "file checksum", "sha256 checksum"],
    category: "Developer",
    icon: Hash,
    isNew: true,
    faq: [
      { q: "Can I verify a download's checksum?", a: "Yes — pick the file, then compare the SHA-256 value with the one published by the software vendor. If they match, the file wasn't altered." },
      { q: "Why isn't MD5 included?", a: "MD5 isn't available in the browser's Web Crypto API and is considered broken for security purposes. SHA-256 is the modern default." },
      { q: "Can a hash be reversed?", a: "No. Cryptographic hashes are one-way functions — you can only check whether an input produces the same hash." },
    ],
  },

  /* ---------------- Utilities ---------------- */
  {
    slug: "word-counter",
    label: "Word Counter",
    title: "Word Counter — Count Words, Characters & Reading Time",
    description:
      "Count words, characters (with and without spaces), sentences and paragraphs as you type, plus reading and speaking time. Great for essays, tweets, LinkedIn posts and SEO meta tags.",
    blurb: "Words, characters, sentences and reading time as you type.",
    keywords: ["word counter", "character counter", "word count", "reading time calculator", "letter counter"],
    category: "Utilities",
    icon: Type,
    isNew: true,
    faq: [
      { q: "How is reading time calculated?", a: "Using an average adult reading speed of about 238 words per minute, and 150 words per minute for speaking time." },
      { q: "Is my text saved?", a: "No. Everything is counted in your browser and disappears when you leave the page." },
      { q: "What are common character limits?", a: "X/Twitter posts: 280 characters. Meta descriptions: about 155–160. LinkedIn posts: 3,000. The counter shows how close you are to each." },
    ],
  },
  {
    slug: "color-converter",
    label: "Color Converter",
    title: "Color Converter — HEX to RGB, HSL & Color Picker",
    description:
      "Convert colors between HEX, RGB and HSL, pick colors visually, and check WCAG contrast against black and white text. Copy any format in one click.",
    blurb: "HEX ↔ RGB ↔ HSL with a picker and contrast check.",
    keywords: ["hex to rgb", "rgb to hex", "color converter", "hsl to hex", "color picker", "contrast checker"],
    category: "Utilities",
    icon: Palette,
    isNew: true,
    faq: [
      { q: "What's the difference between HEX, RGB and HSL?", a: "They describe the same color differently: HEX and RGB give red/green/blue amounts, while HSL uses hue, saturation and lightness, which is easier to tweak by hand." },
      { q: "What does the contrast ratio mean?", a: "WCAG recommends at least 4.5:1 between text and background for normal text (AA), and 7:1 for AAA." },
    ],
  },
  {
    slug: "qr",
    label: "QR Code Generator",
    title: "QR Code Generator — Free, No Sign-Up, Download PNG",
    description:
      "Turn any link or text into a QR code instantly and download it as a PNG. Free forever, no watermark, no sign-up, and codes never expire.",
    blurb: "Turn any URL or text into a QR code. Download as PNG.",
    keywords: ["qr code generator", "free qr code", "url to qr code", "qr code maker", "qr code png"],
    category: "Utilities",
    icon: QrCode,
    faq: [
      { q: "Do these QR codes expire?", a: "No. The link or text is encoded directly into the image — there's no redirect service in between, so it works forever." },
      { q: "Can I use them commercially?", a: "Yes, on menus, flyers, business cards — anywhere. There's no watermark." },
    ],
  },
  {
    slug: "password",
    label: "Password Generator",
    title: "Strong Password Generator — Secure & Random",
    description:
      "Create strong, cryptographically random passwords up to 64 characters with letters, numbers and symbols. Generated locally in your browser and never sent anywhere.",
    blurb: "Cryptographically random passwords. Generated locally, never sent anywhere.",
    keywords: ["password generator", "strong password generator", "random password", "secure password"],
    category: "Utilities",
    icon: KeyRound,
    badge: "Client-only",
    faq: [
      { q: "Are the passwords really random?", a: "Yes. They use crypto.getRandomValues, the browser's cryptographically secure random number generator." },
      { q: "How long should a password be?", a: "At least 16 characters for important accounts. Length matters more than symbols — and use a password manager so you don't have to remember them." },
    ],
  },

  /* ---------------- Services ---------------- */
  {
    slug: "status",
    label: "Status",
    title: "Status — Live Uptime Monitor",
    description:
      "Live uptime and response times for Dhruv Agrawat's websites, APIs and services, with 90-check history.",
    blurb: "Live uptime monitoring for my websites, APIs, and client services.",
    keywords: ["status page", "uptime monitor"],
    category: "Services",
    icon: Activity,
    faq: [],
  },
  {
    slug: "payments",
    label: "Payments",
    title: "Payments",
    description: "Freelance payment details — Wise, PayPal, UPI and bank transfer.",
    blurb: "Freelance quotations, payment info, and Wise transfer details.",
    keywords: [],
    category: "Services",
    icon: CreditCard,
    noindex: true,
    faq: [],
  },
]

export function getTool(slug: string): ToolDef {
  const t = TOOLS.find((x) => x.slug === slug)
  if (!t) throw new Error(`Unknown tool: ${slug}`)
  return t
}

export function relatedTools(slug: string, n = 4): ToolDef[] {
  const me = getTool(slug)
  const pool = TOOLS.filter((t) => t.slug !== slug && !t.noindex && t.category !== "Services")
  const same = pool.filter((t) => t.category === me.category)
  const other = pool.filter((t) => t.category !== me.category)
  return [...same, ...other].slice(0, n)
}

/** Full Next.js metadata for a tool page. */
export function toolMetadata(slug: string): Metadata {
  const t = getTool(slug)
  const path = `/${t.slug}`
  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: { canonical: path },
    openGraph: {
      title: t.title,
      description: t.description,
      url: path,
      siteName: DATA.name,
      type: "website",
    },
    twitter: { card: "summary", title: t.title, description: t.description },
    ...(t.noindex ? { robots: { index: false, follow: false } } : {}),
  }
}
