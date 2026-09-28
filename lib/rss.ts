import { DATA } from "@/data/resume"

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export function rss({
  title,
  description,
  path,
  items,
}: {
  title: string
  description: string
  path: string
  items: { slug: string; title: string; description: string; date: string; tags: string[] }[]
}) {
  const site = DATA.url
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(title)}</title>
<link>${site}${path}</link>
<description>${esc(description)}</description>
<language>en-in</language>
<atom:link href="${site}${path}/rss.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `<item>
<title>${esc(i.title)}</title>
<link>${site}${path}/${i.slug}</link>
<guid>${site}${path}/${i.slug}</guid>
<pubDate>${new Date(i.date).toUTCString()}</pubDate>
<description>${esc(i.description)}</description>
<author>${DATA.contact.email} (${esc(DATA.name)})</author>
${i.tags.map((t) => `<category>${esc(t)}</category>`).join("")}
</item>`
  )
  .join("\n")}
</channel>
</rss>`
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } })
}
