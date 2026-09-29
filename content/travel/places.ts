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
  /** date you last edited this entry (YYYY-MM-DD) — tells search engines to re-crawl it */
  updated: string
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
    updated: "2026-09-29",
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

  {
    slug: "chandrashila-peak",
    name: "Chandrashila Peak",
    region: "Uttarakhand",
    country: "India",
    countryCode: "IN",
    lat: 30.4881,
    lng: 79.2214,
    status: "visited",
    updated: "2026-09-29",
    when: "February 2025",
    summary:
      "A winter climb from Chopta past Tungnath to Chandrashila summit — deep snow, a whiteout on the way up and a clear 360° Himalayan panorama at the top.",
    cover: {
      src: "/photography/web/IMG_20250205_141157.webp",
      alt: "Snow-covered Chandrashila summit ridge under blue sky with Himalayan ranges fading into the distance",
    },
    tags: ["trek", "summit", "snow", "Uttarakhand", "winter", "Garhwal"],
    story: `## The drive up

This was the first trek of my February 2025 trip to Uttarakhand. The morning of 4 February started low, at around 600 metres, beside a perfectly still stretch of water in the Garhwal hills, and the whole day was spent winding up and up through the valleys. By evening the clouds were pouring through the valley below where I stayed that night, and it was obvious there was fresh snow waiting higher up.

![Clouds filling a Garhwal valley at dusk](/photography/web/IMG_20250204_173310.webp)

## Into the snow

On 5 February I set off from Chopta towards Tungnath and Chandrashila. By 9:40 am I was already at almost 3,000 metres, walking across wide meadows buried in snow, with rhododendron and oak trees standing out dark against the white. Mid-morning the weather closed in completely — for a while the trail was just a line of footprints disappearing into a white wall, with no horizon at all.

![A snowy trail vanishing into a whiteout](/photography/web/IMG_20250205_111745.webp)

## The summit

Then it opened up. Early afternoon on the summit the sky turned deep blue, the clouds lifted off the ranges, and the view went on in every direction: snow-covered ridges right below, dark forested valleys, and the high Garhwal Himalaya lined up along the horizon. Chandrashila — "moon rock" — is famous for exactly this 360° panorama, which on a clear day takes in Chaukhamba, Trishul, Nanda Devi, Kedarnath and Bandarpunch. I stayed up there for a couple of hours, watching the clouds build and clear again, before heading down in the late afternoon light.

A few days later I was down on the Ganga in [Rishikesh](/travel/rishikesh), which felt almost tropical by comparison.

## Worth knowing

- In winter the whole trail is under snow; microspikes or gaiters make a huge difference
- The route is short but steep — about 3.5 km from Chopta to Tungnath, then about 1.5 km more to the summit
- Weather changes by the hour; a whiteout in the morning can turn into a perfectly clear summit

New to trekking? Start with [Himachal treks for beginners](/articles/himachal-treks-for-beginners) — most of the advice applies here too.`,
    facts: [
      { label: "When", value: "4 – 5 February 2025" },
      { label: "Summit", value: "≈ 3,690 m" },
      { label: "Route", value: "Chopta → Tungnath → Chandrashila" },
      { label: "Distance", value: "≈ 5 km one way from Chopta" },
      { label: "Difficulty", value: "Easy – moderate (harder in snow)" },
      { label: "Best time", value: "Dec – Apr for snow, Oct – Nov for clear views" },
    ],
    tips: [
      "Start early from Chopta — summit views are usually clearest before the afternoon.",
      "Carry microspikes, gaiters and waterproof gloves in winter.",
      "Don't push on in a whiteout if you can't see the trail; wait or turn back.",
      "Wear sunglasses — the glare off fresh snow at the top is intense.",
    ],
    gallery: [
      { src: "/photography/web/IMG_20250205_094145.webp", alt: "Snow-covered meadow with dark trees under heavy clouds near Chopta", caption: "Snow meadows at 3,000 m" },
      { src: "/photography/web/IMG_20250205_100303.webp", alt: "Trekkers crossing a snowy meadow with Himalayan peaks behind", caption: "On the way to Tungnath" },
      { src: "/photography/web/IMG_20250205_143156.webp", alt: "Snowy rocky ridge below cloud-covered Himalayan peaks", caption: "The view opens up" },
      { src: "/photography/web/IMG_20250205_152624.webp", alt: "Stone cairn on the snowy Chandrashila summit with ridges beyond", caption: "Cairns at the top" },
      { src: "/photography/web/IMG_20250205_155236.webp", alt: "Wide snowfield beneath peaks and clouds on Chandrashila", caption: "Late afternoon on the summit" },
      { src: "/photography/web/IMG_20250204_083828.webp", alt: "Still water reflecting forested hills and clouds in the Garhwal hills", caption: "The drive up, 4 February" },
    ],
  },
  {
    slug: "rishikesh",
    name: "Rishikesh",
    region: "Uttarakhand",
    country: "India",
    countryCode: "IN",
    lat: 30.1187,
    lng: 78.3115,
    status: "visited",
    updated: "2026-09-29",
    when: "February 2025",
    summary:
      "A winter day on the Ganga above Rishikesh — jade-green water, smooth river boulders and the Shivalik foothills closing in on both banks.",
    cover: {
      src: "/photography/web/IMG_20250208_142507.webp",
      alt: "Jade-green Ganga flowing past large grey boulders below forested hills near Rishikesh",
    },
    tags: ["river", "foothills", "Ganga", "Uttarakhand", "winter"],
    story: `## The river in February

I reached Rishikesh in early February 2025, straight after climbing [Chandrashila](/travel/chandrashila-peak) in the snow. Coming down from the cold, the Ganga felt almost warm by comparison — and in winter it runs clear and green instead of the brown monsoon flow most photos show.

Most of the day went on the riverbank upstream of the main town, where the crowds thin out and the river is lined with huge, water-polished rocks. It's the kind of place where you sit on a boulder for an hour and only notice the time because the light on the hills has changed.

![The ghat and boats at Rishikesh with the foothills behind](/photography/web/5.webp)

## Why winter works

February is one of the best months to be here. The days are sunny and mild, the evenings cool, and the river is calm and clean. Rafting season is starting up again, but the beaches along the bank are still quiet on weekdays.

## What I'd do again

- Walk upstream along the river instead of staying around the bridges
- Sit on the rocks through the afternoon and watch the colour of the water change with the light
- Treat it as a slow recovery stop after a trek — it's perfect for that

For a full guide to the walks, waterfalls and forest trails around town, read my [Rishikesh nature guide](/articles/rishikesh-nature-guide).`,
    facts: [
      { label: "When", value: "8 February 2025" },
      { label: "Altitude", value: "≈ 340 m" },
      { label: "Best time", value: "Sep – Nov, Feb – Apr" },
      { label: "Getting there", value: "Train to Haridwar or Rishikesh, or fly into Dehradun" },
    ],
    tips: [
      "Go in winter or spring if you want the river green and clear.",
      "River rocks are slippery near the water — the current is much stronger than it looks.",
      "Weekdays are far quieter than weekends, when Delhi empties into town.",
    ],
    gallery: [
      { src: "/photography/web/IMG_20250208_115615.webp", alt: "Sun flaring over the Ganga and rocky bank near Rishikesh", caption: "Late morning on the bank" },
      { src: "/photography/web/IMG_20250208_145753.webp", alt: "Sunlight sparkling on the Ganga beside a large boulder", caption: "Afternoon light on the water" },
      { src: "/photography/web/5.webp", alt: "Ghat steps, boats and a rocky island in the Ganga at Rishikesh", caption: "The ghats" },
    ],
  },
  {
    slug: "dharamshala",
    name: "Dharamshala",
    region: "Himachal Pradesh",
    country: "India",
    countryCode: "IN",
    lat: 32.219,
    lng: 76.3234,
    status: "visited",
    updated: "2026-09-29",
    when: "June 2025",
    summary:
      "The gateway to the Dhauladhar range — where the Kangra valley ends and the road starts climbing towards McLeod Ganj, Triund and Laka Glacier.",
    cover: {
      src: "/photography/web/IMG_20250614_005210.webp",
      alt: "Green hillside looking out over the Kangra valley under monsoon clouds near Dharamshala",
    },
    tags: ["mountains", "Himachal", "Dhauladhar", "hill station"],
    story: `## The gateway

Dharamshala was the starting point of my June 2025 trip into the Dhauladhars. It's really two towns stacked on one mountainside: lower Dharamshala, the busy market and bus hub down in the Kangra valley, and upper Dharamshala — McLeod Ganj, Bhagsu and Dharamkot — about 600 metres higher up the hill.

The thing that stays with you is the wall of mountains directly behind it. The Dhauladhar range rises so steeply from the valley that you can go from warm, green terraces to snowfields in a single long day on foot. That's exactly what I came for: the plan was a few days on the trail to [Triund](/travel/triund-trek) and [Laka Glacier](/travel/laka-glacier), with [McLeod Ganj](/travel/mcleod-ganj) as the base.

## Weather in June

I arrived just before the monsoon properly set in. Mornings were often clear, but clouds built up over the valley every afternoon — the view you see above, with the hills fading into grey, was the typical light of the trip. Pack a rain jacket even when the forecast looks fine.

## Getting there

- **Bus**: overnight Volvo buses from Delhi reach Dharamshala or McLeod Ganj in about 10–12 hours
- **Train**: Pathankot is the nearest broad-gauge station, around 3 hours by road
- **Air**: Gaggal (Kangra) airport is about 15 km from town

If you're heading up to trek, read [Himachal treks for beginners](/articles/himachal-treks-for-beginners) before you go.`,
    facts: [
      { label: "When", value: "June 2025" },
      { label: "Altitude", value: "≈ 1,450 m (lower town)" },
      { label: "Best time", value: "Mar – Jun, Sep – Nov" },
      { label: "Getting there", value: "Overnight bus from Delhi, or fly into Gaggal (Kangra)" },
    ],
    tips: [
      "Stay up in McLeod Ganj or Dharamkot if you plan to trek — it saves a steep climb every morning.",
      "Afternoon clouds are the norm from June; start walks early.",
      "Shared taxis run between lower Dharamshala and McLeod Ganj all day.",
    ],
  },
  {
    slug: "mcleod-ganj",
    name: "McLeod Ganj",
    region: "Himachal Pradesh",
    country: "India",
    countryCode: "IN",
    lat: 32.2426,
    lng: 76.3213,
    status: "visited",
    updated: "2026-09-29",
    when: "June 2025",
    summary:
      "Sunrise over McLeod Ganj — pastel rooftops stacked on the hillside, deodar forest all around and the Dhauladhars fading into morning haze.",
    cover: {
      src: "/photography/web/IMG_20250613_070511.webp",
      alt: "The sun rising over McLeod Ganj with colourful rooftops and forested mountains",
    },
    tags: ["mountains", "Himachal", "sunrise", "town", "trek base"],
    story: `## The base camp town

McLeod Ganj was my base for the Triund and Laka Glacier trek in June 2025. It sits on a ridge above [Dharamshala](/travel/dharamshala), at roughly 2,000 metres, and it's home to the Tibetan government in exile and the residence of the Dalai Lama — so the streets are a mix of monks, trekkers, cafés, prayer flags and momo stalls.

## Morning after the trek

The photo at the top of this page is the one I like most from the whole trip. I took it at about seven in the morning on 13 June, the day after coming down from Laka Glacier: the sun just clearing the ridge, the town still quiet, and the whole hillside of teal and red rooftops catching the first light. After two days of rock, fog and cold, a slow morning looking over the town felt earned.

![McLeod Ganj rooftops and forest in the soft morning light](/photography/web/IMG_20250613_071639.webp)

## Why start the trek here

The Triund trail starts just above town, at the Gallu Devi temple beyond Dharamkot. Staying in McLeod Ganj or Dharamkot means you can leave early on foot, avoid the afternoon clouds on the ridge and still be at Triund by lunchtime.

## What I'd do again

- Catch the sunrise from a rooftop on the upper side of town
- Spend a rest day here after the trek rather than rushing back to Delhi
- Walk to Bhagsu and Dharamkot — both are an easy stroll away

Continue the story: [the Triund trek](/travel/triund-trek) and [Laka Glacier](/travel/laka-glacier).`,
    facts: [
      { label: "When", value: "11 – 13 June 2025" },
      { label: "Altitude", value: "≈ 2,000 m" },
      { label: "Known for", value: "Tibetan culture, cafés, trekking base" },
      { label: "Getting there", value: "Overnight bus from Delhi, or taxi from Dharamshala (≈ 10 km)" },
    ],
    tips: [
      "Book a room with an east-facing view — sunrise over the town is worth it.",
      "Leave for Triund from Dharamkot early; the ridge often clouds over after noon.",
      "Keep a day spare at the end of the trek for rest and weather delays.",
    ],
    gallery: [
      { src: "/photography/web/IMG_20250613_071639.webp", alt: "Hillside of McLeod Ganj buildings under hazy morning light", caption: "13 June, 7 am" },
      { src: "/photography/web/IMG_20250614_005210.webp", alt: "Grassy slope above McLeod Ganj looking over the valley", caption: "Above town before the climb" },
    ],
  },
  {
    slug: "triund-trek",
    name: "Triund Trek",
    region: "Himachal Pradesh",
    country: "India",
    countryCode: "IN",
    lat: 32.2593,
    lng: 76.3567,
    status: "visited",
    updated: "2026-09-29",
    when: "June 2025",
    summary:
      "The classic Dhauladhar ridge walk above McLeod Ganj: a steep forest climb to open meadows at 2,850 m, the valley on one side and high peaks on the other.",
    cover: {
      src: "/photography/web/IMG_20250611_165200.webp",
      alt: "Misty forested valley seen from the grassy Triund ridge",
    },
    tags: ["trek", "mountains", "Himachal", "Dhauladhar", "beginner friendly"],
    story: `## Up to the ridge

I walked up to Triund on 11 June 2025, starting from above [McLeod Ganj](/travel/mcleod-ganj). The trail climbs steadily through oak and rhododendron forest, with a few stone-stepped switchbacks near the top that feel much longer than they are. By early afternoon I was out of the trees and onto the open grass of the ridge.

![The grassy trail approaching Triund ridge](/photography/web/IMG_20250614_005137.webp)

## The top

Triund is a long, flat meadow at around 2,850 metres. On one side the Kangra valley drops away; on the other the Dhauladhar peaks rise straight up. That day the clouds were rolling through the valley, so the view came and went — one minute a wall of grey, the next a gap showing forest ridges stacked all the way down.

## Carrying on

Most people stop at Triund, camp for the night and walk down in the morning. I kept going: by evening I was past Triund on the rocky ground below Snowline, at just over 3,100 metres, with storm clouds sitting on the peaks and boulders all around. The next morning was the push to [Laka Glacier](/travel/laka-glacier).

## Worth knowing

- It's a good first Himalayan trek — steady, well-marked and doable in a day
- The last stretch is the steepest; pace yourself
- Weather changes fast up here, especially from June

More trail advice in [Himachal treks for beginners](/articles/himachal-treks-for-beginners).`,
    facts: [
      { label: "When", value: "11 June 2025" },
      { label: "Altitude", value: "≈ 2,850 m" },
      { label: "Distance", value: "≈ 7–9 km one way from Dharamkot / McLeod Ganj" },
      { label: "Difficulty", value: "Easy – moderate" },
      { label: "Best time", value: "Mar – Jun, Sep – Nov" },
    ],
    tips: [
      "Start early — the ridge often clouds over by afternoon.",
      "Carry 2 litres of water; shops on the way are seasonal and expensive.",
      "Take a warm layer even in summer — it's cold on the ridge once the sun goes.",
      "Carry your rubbish back down; Triund gets a lot of visitors.",
    ],
    gallery: [
      { src: "/photography/web/IMG_20250614_005137.webp", alt: "Grassy slope and trail below the Triund ridge", caption: "The last stretch to the ridge" },
      { src: "/photography/web/IMG_20250611_165200.webp", alt: "Clouds filling the valley below Triund", caption: "Clouds over the valley" },
      { src: "/photography/web/IMG_20250611_181843.webp", alt: "Deodar trees on a rocky slope under heavy clouds", caption: "Evening above Triund" },
      { src: "/photography/web/IMG_20250611_184649.webp", alt: "Boulder field below the Dhauladhar peaks under storm clouds", caption: "Below Snowline, 3,100 m" },
    ],
  },
  {
    slug: "laka-glacier",
    name: "Laka Glacier",
    region: "Himachal Pradesh",
    country: "India",
    countryCode: "IN",
    lat: 32.2755,
    lng: 76.3677,
    status: "visited",
    updated: "2026-09-29",
    when: "June 2025",
    summary:
      "Beyond Triund and Snowline: a boulder valley at around 3,350 m where snow still lies in the gullies under the Dhauladhar wall, even in June.",
    cover: {
      src: "/photography/web/IMG20250612075827.webp",
      alt: "Boulder-strewn alpine valley leading up to the Dhauladhar peaks near Laka Glacier",
    },
    tags: ["trek", "glacier", "high altitude", "Himachal", "Dhauladhar"],
    story: `## Above the crowds

Laka Glacier is the next step up from [Triund](/travel/triund-trek), and far fewer people make it. After a night on the rocky ground below Snowline, I started out before sunrise on 12 June 2025. The path climbs through a huge valley of grey granite boulders and short alpine grass, with the Dhauladhar ridge growing taller at the head of it.

![The boulder valley towards Laka Glacier at dawn](/photography/web/IMG20250612075910.webp)

## The glacier

By June the glacier is mostly a long tongue of old snow and ice packed into the gullies at the top of the valley, with meltwater running out from under the boulders. It isn't a clean white icefield — it's grey, rocky and raw, which is exactly what makes it feel like proper high mountain country after the grassy meadows of Triund.

Around mid-morning the clouds lifted for a while and the whole ridge came out: sharp rock peaks, streaks of snow, and deodars clinging to the slopes below. Then the fog came back in, and the walk down was through a quiet, grey forest where you could only see a few trees ahead.

## Worth knowing

- Treat it as a two-day trip from McLeod Ganj, with a night at Triund or Snowline
- The trail above Snowline is rocky and loose — good shoes matter more than speed
- Turn back if the weather closes in; the boulder field is hard to navigate in fog

After the descent I spent a slow morning in [McLeod Ganj](/travel/mcleod-ganj). Planning your own first trek? Start with [Himachal treks for beginners](/articles/himachal-treks-for-beginners).`,
    facts: [
      { label: "When", value: "12 June 2025" },
      { label: "Altitude", value: "≈ 3,350 m" },
      { label: "Route", value: "McLeod Ganj → Triund → Snowline → Laka Glacier" },
      { label: "Difficulty", value: "Moderate" },
      { label: "Best time", value: "May – June, late Sep – Oct" },
    ],
    tips: [
      "Start before sunrise from Triund or Snowline for the clearest views.",
      "Carry layers, a rain shell and gloves — it's cold near the snow even in June.",
      "Check the weather before going beyond Snowline; don't push on into a storm.",
    ],
    gallery: [
      { src: "/photography/web/IMG_20250612_100741.webp", alt: "Dhauladhar peaks with streaks of snow above deodar trees", caption: "The ridge clears, mid-morning" },
      { src: "/photography/web/IMG_20250614_005323.webp", alt: "Snow and ice filling a rocky gully at the head of the valley", caption: "The glacier gully" },
      { src: "/photography/web/IMG_20250612_060747.webp", alt: "Boulders and grass below a forested peak at dawn", caption: "Early start" },
      { src: "/photography/web/IMG_20250612_103227.webp", alt: "Rocky slope disappearing into fog", caption: "Fog rolling back in" },
      { src: "/photography/web/IMG_20250612_110659.webp", alt: "Narrow rocky trail through foggy forest", caption: "The walk down" },
    ],
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
    updated: "2026-09-29",
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

/**
 * Places with very little written yet stay visible on the globe but are kept out of
 * search results until the story has some substance (about 150 words).
 */
export function isIndexable(p: Place) {
  const words = `${p.summary} ${p.story ?? ""}`.split(/\s+/).filter(Boolean).length
  return !p.draft && words >= 150
}

export function getPlace(slug: string) {
  return publishedPlaces.find((p) => p.slug === slug)
}
