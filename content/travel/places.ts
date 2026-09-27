/* =========================================================
   TRAVEL JOURNAL — every place on the /travel globe lives here.

   To add a place: copy one block below, change the values, save.
   - status "visited"  → solid blue pin, "Been there"
   - status "wishlist" → gold ring, "Want to go"
   - draft: true       → only visible while running locally (npm run dev),
                         hidden on the live site until you remove it
   - story is Markdown: ## headings, **bold**, *italic*, - lists, [links](url),
     ![photo caption](/path/to/photo.webp)
   - photos: put images in /public/travel/<slug>/ and list them in `gallery`
   Coordinates: right-click a spot on Google Maps → the first menu item copies "lat, lng".
   ========================================================= */

export type PlaceStatus = "visited" | "wishlist"

export interface Place {
  slug: string
  name: string
  region: string
  country: string
  /** ISO 3166-1 alpha-2, used for country stats */
  countryCode: string
  lat: number
  lng: number
  status: PlaceStatus
  /** when you went (visited) or hope to go (wishlist), free text: "Feb 2025", "Winter 2026" */
  when?: string
  /** one or two sentences — shows on the globe card, listings and in search results */
  summary: string
  cover?: { src: string; alt: string }
  tags?: string[]
  /** Markdown body of the journal entry */
  story?: string
  /** quick practical info shown in the sidebar */
  facts?: { label: string; value: string }[]
  tips?: string[]
  gallery?: { src: string; alt: string; caption?: string }[]
  draft?: boolean
}

export const PLACES: Place[] = [
  {
    slug: "new-delhi",
    name: "New Delhi",
    region: "Delhi",
    country: "India",
    countryCode: "IN",
    lat: 28.6139,
    lng: 77.209,
    status: "visited",
    when: "Home base",
    summary: "Home base — where I live, work and plan every trip that starts on this globe.",
    tags: ["home", "city"],
    story: `## Home base

Every journey on this map starts here. Delhi is where I build, ship and daydream about the next mountain.

*More stories from home coming soon.*`,
    facts: [
      { label: "Status", value: "Home" },
      { label: "Region", value: "Delhi, India" },
    ],
  },

  /* ---------- Drafts: examples from my photo folder — edit them, then remove `draft: true` ---------- */
  {
    slug: "rishikesh",
    name: "Rishikesh",
    region: "Uttarakhand",
    country: "India",
    countryCode: "IN",
    lat: 30.0869,
    lng: 78.2676,
    status: "visited",
    when: "Add the month you went",
    summary: "The Ganga, the ghats and the foothills — replace this with one line about the trip.",
    cover: { src: "/summit/g2-1600.webp", alt: "The Ganga flowing past rocks and ghats in Rishikesh" },
    tags: ["river", "foothills"],
    story: `## The river

Write about the trip here. What did you do first? Where did you stay? What surprised you?

## What I'd do again

- One thing you loved
- A place to eat
- A walk or view worth the effort`,
    facts: [
      { label: "Best time", value: "Sep – Nov, Feb – Apr" },
      { label: "Getting there", value: "Train to Haridwar or Rishikesh, or fly into Dehradun" },
    ],
    tips: ["Add your own tips here."],
    draft: true,
  },
  {
    slug: "dharamshala",
    name: "Dharamshala & McLeod Ganj",
    region: "Himachal Pradesh",
    country: "India",
    countryCode: "IN",
    lat: 32.2432,
    lng: 76.3213,
    status: "visited",
    when: "Add the month you went",
    summary: "A hill town waking up under the Dhauladhars — replace this with your own line.",
    cover: { src: "/summit/summit-2400.webp", alt: "Sunrise over a hill town and forested mountains" },
    tags: ["mountains", "trek"],
    story: `## Morning over the town

Write about the trip here.`,
    gallery: [
      { src: "/summit/g7-1600.webp", alt: "Alpine valley full of boulders below misty peaks", caption: "Boulder valley" },
      { src: "/summit/g6-1600.webp", alt: "Rocky forest trail disappearing into fog", caption: "Into the fog" },
      { src: "/summit/g8-1600.webp", alt: "Storm clouds rolling over a forested valley", caption: "Storm coming in" },
    ],
    draft: true,
  },
  {
    slug: "spiti-valley",
    name: "Spiti Valley",
    region: "Himachal Pradesh",
    country: "India",
    countryCode: "IN",
    lat: 32.2461,
    lng: 78.0349,
    status: "wishlist",
    when: "Someday",
    summary: "Example wishlist entry — the cold desert, monasteries on cliffs and the highest villages in India.",
    tags: ["high altitude", "road trip"],
    story: `## Why I want to go

Write what draws you here, and any plans — route ideas, people to travel with, what to read first.`,
    draft: true,
  },
]

const showDrafts = process.env.NODE_ENV !== "production"

/** Places that should appear on the site right now. */
export const publishedPlaces = PLACES.filter((p) => showDrafts || !p.draft)

export function getPlace(slug: string) {
  return publishedPlaces.find((p) => p.slug === slug)
}
