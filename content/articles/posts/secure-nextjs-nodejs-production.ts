import { defineArticle } from "@/content/define"

export default defineArticle({
  slug: "secure-nextjs-nodejs-production",
  title: "How to Secure a Next.js and Node.js App in Production",
  description:
    "A production security checklist for Next.js and Node.js: secrets, security headers and CSP, auth, server actions, validation and rate limiting.",
  date: "2026-03-18",
  category: "Security",
  tags: ["Security", "Next.js", "Node.js", "DevOps", "Web Development"],
  body: `Next.js makes it easy to ship fast — and easy to ship something insecure without noticing, because server and client code live side by side. This is the checklist I run through before any client app goes live.

## 1. Know what reaches the browser

The biggest Next.js-specific mistake: leaking server-only data to the client.

- Environment variables prefixed with \`NEXT_PUBLIC_\` are **bundled into the JavaScript every visitor downloads**. Only public, non-secret values belong there.
- Anything you pass as props from a Server Component to a Client Component is serialised into the page. Don't pass a whole user record when the component needs a name.
- Mark server-only modules with the \`server-only\` package, so importing them into client code fails the build:

\`\`\`ts
// lib/db.ts
import "server-only"
export const db = createClient(process.env.DATABASE_URL!)
\`\`\`

## 2. Treat server actions and route handlers as public APIs

Server Actions look like normal functions, but each one is an HTTP endpoint anyone can call. Every one needs:

\`\`\`ts
"use server"
import { z } from "zod"

const Input = z.object({ title: z.string().min(1).max(200) })

export async function createPost(raw: unknown) {
  const session = await auth()                      // 1. who is this?
  if (!session) throw new Error("Unauthorized")
  const data = Input.parse(raw)                     // 2. is the input valid?
  if (!canCreatePost(session.user)) throw new Error("Forbidden")  // 3. are they allowed?
  return db.post.create({ data: { ...data, authorId: session.user.id } })
}
\`\`\`

Authentication, validation, authorisation — every time. Middleware is a convenience, not a security boundary: re-check authorisation where the data is read or written.

## 3. Security headers and a CSP

Set headers once in \`next.config\`:

\`\`\`js
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  },
}
\`\`\`

Then add a **Content-Security-Policy**. The strongest version uses a per-request nonce generated in middleware; the Next.js docs have a complete example. Start with \`Content-Security-Policy-Report-Only\` to see what would break before enforcing.

## 4. Authentication and sessions

- Use a mature library (Auth.js, Clerk, Lucia-style patterns, or your provider's SDK) rather than rolling your own crypto.
- Session cookies: \`HttpOnly\`, \`Secure\`, \`SameSite=Lax\`, sensible expiry.
- Hash passwords with **argon2id** or **bcrypt** — never plain SHA.
- Rotate the session on login and privilege changes; invalidate on logout and password reset.
- Offer passkeys or 2FA for admin accounts.

## 5. Validate every input

Use one schema library (Zod, Valibot) at every boundary — forms, route handlers, server actions, webhooks, environment variables:

\`\`\`ts
const Env = z.object({
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
})
export const env = Env.parse(process.env)   // crash at boot, not at 3 a.m.
\`\`\`

For webhooks (Stripe, Razorpay, GitHub), **verify the signature** before trusting the payload.

## 6. Rate limiting and abuse

Serverless means you can't keep counters in memory. Use a shared store — Upstash Redis with \`@upstash/ratelimit\`, or your platform's firewall rules — and limit login, sign-up, OTP, password reset, contact forms and any AI or paid-API endpoint. Add a bot check like Cloudflare Turnstile on public forms.

## 7. Database safety

- Parameterised queries or an ORM, always.
- A database user with only the permissions the app needs — not the superuser.
- Row-level security if you use Supabase and ever query from the client.
- Encrypted, automated backups with a tested restore.

## 8. Errors and logging

- Never send stack traces or database errors to users in production.
- Log security events: logins, failed logins, permission denials, password resets.
- **Never log secrets, tokens, passwords or full card/Aadhaar/PAN numbers.**
- Wire up error monitoring (Sentry or similar) and uptime alerts.

## 9. Dependencies and supply chain

- Commit your lockfile and install with \`npm ci\` / \`pnpm install --frozen-lockfile\` in CI.
- Dependabot or Renovate for updates; \`npm audit --omit=dev\` in CI.
- Keep Next.js itself up to date — framework security patches ship regularly.

## 10. Before launch

A final pass I do on every project:

1. Scan headers at securityheaders.com
2. Search the built JS in the browser's DevTools for any secret-looking strings
3. Try every API route logged out and as a different user
4. Run \`gitleaks\` on the repo history
5. Confirm backups and restore

None of this is glamorous, but it's the difference between an app that survives its first year and one that ends up as a breach notification. The underlying bug classes are covered in more depth in [8 web vulnerabilities every developer should know](/articles/web-vulnerabilities-every-developer-should-know).`,
})
