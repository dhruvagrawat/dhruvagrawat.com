import { defineArticle } from "@/content/define"

export default defineArticle({
  slug: "web-vulnerabilities-every-developer-should-know",
  title: "8 Web Vulnerabilities Every Developer Should Know",
  description:
    "Broken access control, injection, XSS, CSRF, SSRF, leaked secrets and more — how each attack works and how to fix it, with code examples.",
  date: "2026-01-26",
  category: "Security",
  tags: ["Security", "OWASP", "Web Development", "Node.js", "Best Practices"],
  body: `The OWASP Top 10 has listed roughly the same families of bugs for over a decade — because developers keep writing them. None of them need exotic knowledge to prevent. Here are the eight I see most often when auditing client codebases, how they're exploited, and what to do instead.

## 1. Broken access control

The most common serious bug on the web. The app checks that you're **logged in**, but not that you're allowed to see **this** thing.

\`\`\`ts
// ❌ any logged-in user can read any invoice by changing the ID
app.get("/api/invoices/:id", requireLogin, async (req, res) => {
  res.json(await db.invoice.findUnique({ where: { id: req.params.id } }))
})

// ✅ scope the query to the current user
app.get("/api/invoices/:id", requireLogin, async (req, res) => {
  const invoice = await db.invoice.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
  })
  if (!invoice) return res.sendStatus(404)
  res.json(invoice)
})
\`\`\`

**Fix:** check ownership or role on every request, on the server. Hiding a button in the UI is not access control. Use non-guessable IDs (UUIDs), but never rely on them alone.

## 2. Injection (SQL and friends)

Mixing user input into a query string lets attackers rewrite the query.

\`\`\`ts
// ❌ ?email=' OR '1'='1 returns every user
db.query(\`SELECT * FROM users WHERE email = '\${email}'\`)

// ✅ parameterised query — input is always data, never code
db.query("SELECT * FROM users WHERE email = $1", [email])
\`\`\`

**Fix:** parameterised queries or an ORM, always. The same idea applies to shell commands (never build them from input — use argument arrays) and NoSQL queries (validate that fields are strings, not objects like \`{"$ne": null}\`).

## 3. Cross-site scripting (XSS)

Attacker-controlled text gets rendered as HTML and runs as JavaScript in other users' browsers — stealing sessions or acting as them.

**Fix:**

- Let your framework escape output. React does this by default — the danger is \`dangerouslySetInnerHTML\` and \`innerHTML\`.
- If you must render user HTML (a rich-text editor), sanitise it with **DOMPurify** first.
- Add a **Content-Security-Policy** header so injected scripts can't run even if one slips through.
- Mark session cookies \`HttpOnly\` so scripts can't read them.

## 4. Cross-site request forgery (CSRF)

Another site makes your logged-in user's browser send a request to your app — "transfer money", "change email" — riding on their cookies.

**Fix:** set cookies with \`SameSite=Lax\` (or \`Strict\`), require a CSRF token for state-changing forms if you use cookie sessions, and never change state on GET requests.

## 5. Server-side request forgery (SSRF)

Your server fetches a URL the user supplies ("import from URL", link previews, webhooks). Attackers point it at internal addresses — like the cloud metadata service at \`169.254.169.254\` — and read secrets.

**Fix:** allow-list domains where possible, resolve the hostname and block private and link-local IP ranges, disable redirects or re-check after each one, and use IMDSv2 on AWS.

## 6. Leaked secrets

API keys committed to git, printed in logs, or shipped to the browser.

**Fix:**

- Keep secrets in environment variables or a secrets manager, never in code.
- In Next.js, anything prefixed \`NEXT_PUBLIC_\` **is sent to every visitor** — never put private keys there.
- Scan repos with \`gitleaks\` or GitHub secret scanning.
- If a key leaks, **rotate it immediately**. Deleting the commit doesn't un-leak it.

## 7. Vulnerable and outdated dependencies

Your app is mostly other people's code. One compromised or outdated package is enough.

**Fix:** \`npm audit\` in CI, Dependabot or Renovate for automatic update PRs, commit your lockfile, remove unused packages, and be wary of brand-new packages with names one letter off from popular ones (typosquatting).

## 8. No rate limiting

Without limits, attackers can brute-force logins, enumerate users, spam OTPs (which costs you real money in SMS fees) or scrape your data.

\`\`\`ts
import rateLimit from "express-rate-limit"

app.use("/api/auth/", rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 }))
\`\`\`

**Fix:** rate-limit auth, OTP, password-reset and expensive endpoints — per IP *and* per account. Return the same message for "wrong email" and "wrong password" so users can't be enumerated.

## A habit, not a checklist

Security isn't a phase at the end of a project. Three habits catch most of the above: **every endpoint checks authorisation**, **all input is validated** (with a schema library like Zod), and **every PR gets a second pair of eyes**. For deployment-specific settings, see my guide to [securing a Next.js and Node.js app in production](/articles/secure-nextjs-nodejs-production).`,
})
