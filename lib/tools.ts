import type { Metadata } from "next"
import {
  Activity,
  ArrowLeftRight,
  CaseSensitive,
  Cake,
  Diff,
  FileKey,
  ImageDown,
  Landmark,
  Link2,
  Percent,
  PiggyBank,
  Receipt,
  Regex,
  Ruler,
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
import { seoTitle } from "@/lib/seo"

/* =========================================================
   Single source of truth for every tool on the site.
   Drives: the /tools hub, page <title>/description/canonical,
   JSON-LD, the FAQ + "related tools" blocks, and the sitemap.
   ========================================================= */

export type ToolCategory = "Live Data" | "Calculators" | "Developer" | "Utilities" | "Services"

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
  Calculators: "Money, maths and everyday calculators — instant results, no sign-up",
  Developer: "Everyday developer utilities — everything runs in your browser",
  Utilities: "Handy tools that run entirely in your browser — no server needed",
  Services: "My service info and monitoring",
}

export const CATEGORY_ORDER: ToolCategory[] = ["Live Data", "Calculators", "Developer", "Utilities", "Services"]

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

  /* ---------------- Calculators ---------------- */
  {
    slug: "emi-calculator",
    label: "EMI Calculator",
    title: "EMI Calculator — Home, Car & Personal Loan EMI with Amortization",
    description:
      "Calculate the monthly EMI, total interest and total payment for home, car or personal loans, with a year-by-year amortization schedule.",
    blurb: "Monthly EMI, total interest and a full amortization schedule.",
    keywords: ["emi calculator", "loan emi calculator", "home loan emi", "car loan emi", "personal loan calculator", "amortization schedule"],
    category: "Calculators",
    icon: Landmark,
    isNew: true,
    faq: [
      { q: "How is EMI calculated?", a: "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly instalments." },
      { q: "Does a longer tenure reduce my cost?", a: "It lowers the monthly EMI but increases the total interest you pay. The calculator shows both so you can compare." },
      { q: "Does this include processing fees or insurance?", a: "No — it covers principal and interest only. Lenders may add processing fees, GST on fees and optional insurance." },
    ],
  },
  {
    slug: "sip-calculator",
    label: "SIP Calculator",
    title: "SIP Calculator — Mutual Fund SIP Returns with Step-Up",
    description:
      "Estimate the future value of a monthly SIP in mutual funds. Add an annual step-up, see invested amount vs estimated returns, and a year-by-year growth table.",
    blurb: "Future value of a monthly SIP, with optional annual step-up.",
    keywords: ["sip calculator", "mutual fund calculator", "sip return calculator", "step up sip calculator", "investment calculator"],
    category: "Calculators",
    icon: PiggyBank,
    isNew: true,
    faq: [
      { q: "How does the SIP calculator work?", a: "Each monthly instalment is compounded at the expected annual return (converted to a monthly rate) until the end of the period, assuming you invest at the start of each month." },
      { q: "What is a step-up SIP?", a: "Increasing your monthly SIP by a fixed percentage every year — for example 10% — usually in line with salary hikes. It can grow the final corpus considerably." },
      { q: "Are the returns guaranteed?", a: "No. Mutual fund returns vary with the market; this is an estimate based on a constant rate of return, not financial advice." },
    ],
  },
  {
    slug: "gst-calculator",
    label: "GST Calculator",
    title: "GST Calculator India — Add or Remove GST (5%, 18%, 40%)",
    description:
      "Add or remove GST with the current rates (5%, 18%, 40% and more) or a custom rate, and see the CGST, SGST and IGST split instantly.",
    blurb: "Add or remove GST with CGST / SGST / IGST split.",
    keywords: ["gst calculator", "gst calculator india", "reverse gst calculator", "gst inclusive calculator", "cgst sgst calculator", "18% gst"],
    category: "Calculators",
    icon: Receipt,
    isNew: true,
    faq: [
      { q: "What are the current GST rates?", a: "Since 22 September 2025 (GST 2.0), most goods and services fall under 5% or 18%, with 40% for luxury and sin goods. Special rates of 3% (gold, silver) and 0.25% (rough diamonds) still apply, and some essentials are exempt." },
      { q: "How do I remove GST from an inclusive price?", a: "Base price = inclusive price × 100 ÷ (100 + GST rate). For 18% GST, ₹1,180 inclusive means a ₹1,000 base price and ₹180 GST." },
      { q: "When is it CGST + SGST vs IGST?", a: "Sales within the same state are split equally into CGST and SGST. Sales between states (and imports) attract IGST at the full rate." },
    ],
  },
  {
    slug: "percentage-calculator",
    label: "Percentage Calculator",
    title: "Percentage Calculator — % of a Number, % Change & More",
    description:
      "Work out X% of a number, what percent one number is of another, percentage increase or decrease, and discounts — all on one page with the formula shown.",
    blurb: "% of a number, % change, discounts — with formulas.",
    keywords: ["percentage calculator", "percent of a number", "percentage increase calculator", "percentage change", "discount calculator"],
    category: "Calculators",
    icon: Percent,
    isNew: true,
    faq: [
      { q: "How do I calculate percentage change?", a: "Percentage change = (new − old) ÷ old × 100. A rise from 80 to 100 is a 25% increase." },
      { q: "How do I find what percent X is of Y?", a: "Divide X by Y and multiply by 100. For example, 45 of 60 is 45 ÷ 60 × 100 = 75%." },
    ],
  },
  {
    slug: "age-calculator",
    label: "Age Calculator",
    title: "Age Calculator — Exact Age in Years, Months & Days",
    description:
      "Find your exact age in years, months and days from your date of birth, plus total days, weeks and hours lived, and a countdown to your next birthday.",
    blurb: "Exact age in years, months and days, plus next birthday.",
    keywords: ["age calculator", "date of birth calculator", "how old am i", "age in days", "birthday countdown"],
    category: "Calculators",
    icon: Cake,
    isNew: true,
    faq: [
      { q: "How is age calculated?", a: "By counting full years, then full months, then remaining days between your date of birth and the chosen date — the same way age is counted on official forms." },
      { q: "Can I calculate age on a past or future date?", a: "Yes. Change the 'age on' date to find someone's age on any day, such as an exam cut-off date." },
      { q: "What about birthdays on 29 February?", a: "In non-leap years the next birthday is counted as 1 March." },
    ],
  },
  {
    slug: "unit-converter",
    label: "Unit Converter",
    title: "Unit Converter — Length, Weight, Temperature, Area & More",
    description:
      "Convert metric and imperial units for length, weight, temperature, area, volume, speed and data storage — fast, accurate and free.",
    blurb: "Length, weight, temperature, area, volume, speed and data.",
    keywords: ["unit converter", "cm to inches", "kg to lbs", "celsius to fahrenheit", "km to miles", "sq ft to sq m", "mb to gb"],
    category: "Calculators",
    icon: Ruler,
    isNew: true,
    faq: [
      { q: "Which units are supported?", a: "Length, weight, temperature, area, volume, speed and digital storage — with common metric, imperial and US units in each." },
      { q: "Is 1 GB 1000 MB or 1024 MB?", a: "Both are used. The converter lists decimal units (KB, MB, GB = powers of 1000) and binary units (KiB, MiB, GiB = powers of 1024) separately." },
    ],
  },

  /* ---------------- Developer ---------------- */
  {
    slug: "json-formatter",
    label: "JSON Formatter",
    title: "JSON Formatter & Validator — Beautify, Minify and Check JSON",
    description:
      "Format, beautify, minify or validate JSON instantly, with the exact line and column of any error. Runs in your browser — nothing is uploaded.",
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
      "Generate secure random UUID v4 / GUID values — one or up to 500 at once, upper or lower case, with or without hyphens. Copy all in one click.",
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
      "Convert Unix epoch timestamps (seconds or milliseconds) to readable dates in UTC and your time zone, and any date back into a timestamp.",
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
      "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text or file instantly. Nothing is uploaded — hashing happens on your device.",
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

  {
    slug: "jwt-decoder",
    label: "JWT Decoder",
    title: "JWT Decoder — Decode JSON Web Tokens Online",
    description:
      "Decode a JWT's header and payload, see issued-at and expiry times, and check if it has expired. Decoded locally — tokens never leave your browser.",
    blurb: "Decode JWT header & payload, check expiry. Nothing is uploaded.",
    keywords: ["jwt decoder", "decode jwt", "jwt parser", "json web token decoder", "jwt expiry checker"],
    category: "Developer",
    icon: FileKey,
    isNew: true,
    faq: [
      { q: "Is it safe to paste my token here?", a: "Decoding happens entirely in your browser — the token is never sent anywhere. Still, treat production tokens like passwords and avoid sharing them." },
      { q: "Does this verify the signature?", a: "No. It decodes the header and payload, which are only Base64URL-encoded. Verifying the signature requires the secret or public key and should happen on your server." },
      { q: "What do exp, iat and nbf mean?", a: "exp is the expiry time, iat is when the token was issued, and nbf is 'not before'. All are Unix timestamps in seconds; the decoder shows them as readable dates." },
    ],
  },
  {
    slug: "url-encoder",
    label: "URL Encoder / Decoder",
    title: "URL Encode & Decode Online — Percent-Encoding and Query Parser",
    description:
      "Percent-encode or decode URLs and query strings, and break any URL into protocol, host, path and a readable table of query parameters.",
    blurb: "Percent-encode / decode and parse query parameters.",
    keywords: ["url encoder", "url decoder", "urlencode online", "percent encoding", "query string parser"],
    category: "Developer",
    icon: Link2,
    isNew: true,
    faq: [
      { q: "What's the difference between encodeURI and encodeURIComponent?", a: "encodeURIComponent escapes everything that isn't safe inside a single query value (including / ? & =). encodeURI keeps those characters so a full URL stays usable." },
      { q: "Why do spaces become %20 or +?", a: "%20 is standard percent-encoding. + means a space only in HTML form data (application/x-www-form-urlencoded); the decoder handles both." },
    ],
  },
  {
    slug: "regex-tester",
    label: "Regex Tester",
    title: "Regex Tester — Test JavaScript Regular Expressions Live",
    description:
      "Test regular expressions with live match highlighting, capture and named groups, flags and a replace preview, using the JavaScript regex engine.",
    blurb: "Live match highlighting, groups and replace preview.",
    keywords: ["regex tester", "regular expression tester", "regex online", "javascript regex", "regex checker"],
    category: "Developer",
    icon: Regex,
    isNew: true,
    faq: [
      { q: "Which regex flavour is used?", a: "JavaScript (ECMAScript), the same engine your browser and Node.js use. Most syntax also works in Python, Java and PCRE, but lookbehind and named-group syntax can differ." },
      { q: "What do the flags mean?", a: "g finds all matches, i ignores case, m makes ^ and $ match at line breaks, s lets . match newlines, and u enables full Unicode." },
    ],
  },
  {
    slug: "diff-checker",
    label: "Diff Checker",
    title: "Diff Checker — Compare Two Texts and Find Differences",
    description:
      "Compare two versions of text or code and see added and removed lines side by side. Ignore whitespace or case. Nothing is uploaded.",
    blurb: "Compare two texts line by line with highlighted changes.",
    keywords: ["diff checker", "text compare", "compare two texts", "diff tool online", "code compare"],
    category: "Developer",
    icon: Diff,
    isNew: true,
    faq: [
      { q: "How does the comparison work?", a: "It finds the longest common sequence of lines between the two texts, then marks everything else as added or removed — the same idea behind git diff." },
      { q: "Is there a size limit?", a: "It comfortably handles a few thousand lines. Very large files are better compared with git diff or a desktop tool." },
    ],
  },

  /* ---------------- Utilities ---------------- */
  {
    slug: "word-counter",
    label: "Word Counter",
    title: "Word Counter — Count Words, Characters & Reading Time",
    description:
      "Count words, characters, sentences and paragraphs as you type, plus reading time — handy for essays, tweets, LinkedIn posts and meta descriptions.",
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
      "Create strong, random passwords up to 64 characters with letters, numbers and symbols. Generated in your browser and never sent anywhere.",
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

  {
    slug: "case-converter",
    label: "Case Converter",
    title: "Case Converter — UPPER, lower, Title, camelCase, snake_case",
    description:
      "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case and CONSTANT_CASE in one click.",
    blurb: "UPPER, lower, Title, camelCase, snake_case and more.",
    keywords: ["case converter", "uppercase to lowercase", "title case converter", "camelcase converter", "snake case converter"],
    category: "Utilities",
    icon: CaseSensitive,
    isNew: true,
    faq: [
      { q: "What's the difference between Title Case and Sentence case?", a: "Title Case capitalises the main words, as in headlines; Sentence case only capitalises the first word of each sentence (and proper nouns)." },
      { q: "When do developers use camelCase vs snake_case?", a: "camelCase is common in JavaScript and Java, snake_case in Python and databases, kebab-case in URLs and CSS, and CONSTANT_CASE for constants." },
    ],
  },
  {
    slug: "image-compressor",
    label: "Image Compressor",
    title: "Image Compressor — Compress & Resize JPG, PNG, WebP Online",
    description:
      "Compress and resize photos in your browser, convert to JPEG, WebP or PNG and compare before and after. Your images are never uploaded.",
    blurb: "Compress, resize and convert images — never uploaded.",
    keywords: ["image compressor", "compress jpg", "reduce image size", "resize image", "png to webp", "compress image to 100kb"],
    category: "Utilities",
    icon: ImageDown,
    isNew: true,
    faq: [
      { q: "Are my images uploaded?", a: "No. Compression uses your browser's canvas, so photos never leave your device — safe for personal documents." },
      { q: "Which format gives the smallest file?", a: "WebP is usually 25–35% smaller than JPEG at similar quality. Use PNG only for graphics that need transparency or sharp edges." },
      { q: "How do I get under a size limit like 100 KB?", a: "Lower the quality slider and reduce the maximum width until the 'after' size is below the limit — the new size updates instantly." },
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
    title: seoTitle(t.title),
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
