# dhruvagrawat.com

The personal website of **Dhruv Agrawat**: portfolio, writing, travel journal, and a collection of free everyday web tools.

**Live:** [dhruvagrawat.com](https://dhruvagrawat.com)

## What's on the site

- **Portfolio**: projects, about page, and résumé
- **Writing**: articles, blog posts, and recipes (MDX content in `content/`)
- **Travel journal**: places visited and first-hand trek notes
- **Photography & music**
- **Free tools**: 30+ small utilities that run in the browser, including JSON formatter, regex tester, JWT decoder, hash / UUID / QR / password generators, Base64 and URL encoders, unit, currency and color converters, EMI / SIP / GST / percentage / age calculators, image compressor, word counter, and diff checker

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- Tailwind CSS 4 + Framer Motion
- Vercel Analytics, IndexNow for search indexing, `llms.txt` for AI crawlers

## Run locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000. Database setup scripts are in `scripts/`, and `SETUP_GUIDE.md` covers the full setup.
