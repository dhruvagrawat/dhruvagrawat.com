// Tells Bing, Yandex, Seznam, Naver and other IndexNow search engines which pages changed,
// so they re-crawl them within minutes instead of weeks. Bing's index also feeds
// ChatGPT search, Microsoft Copilot and DuckDuckGo.
//
//   node scripts/indexnow.mjs          → pages whose sitemap <lastmod> is within the last 3 days
//   ALL=true node scripts/indexnow.mjs → every page in the sitemap
//
// Runs automatically after each production deploy (.github/workflows/indexnow.yml).

const SITE = process.env.SITE_URL ?? "https://dhruvagrawat.com"
const KEY = "0a247881431f40f78e8d40ad3ac5f822" // must match public/<KEY>.txt
const DAYS = Number(process.env.DAYS ?? 3)
const ALL = process.env.ALL === "true"

const keyRes = await fetch(`${SITE}/${KEY}.txt`)
if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
  console.error(`Key file ${SITE}/${KEY}.txt is not live yet — aborting.`)
  process.exit(1)
}

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
const cutoff = Date.now() - DAYS * 86_400_000
const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
  .map(([, block]) => ({
    loc: block.match(/<loc>(.*?)<\/loc>/)?.[1],
    lastmod: block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
  }))
  .filter((u) => u.loc && (ALL || (u.lastmod && new Date(u.lastmod).getTime() >= cutoff)))
  .map((u) => u.loc)

if (urls.length === 0) {
  console.log(`No pages changed in the last ${DAYS} days — nothing to submit.`)
  process.exit(0)
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
})
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URL(s)`)
urls.forEach((u) => console.log("  " + u))
if (res.status >= 400) process.exit(1)
