import { defineArticle } from "@/content/define"

export default defineArticle({
  slug: "website-security-checklist-small-business",
  title: "Website Security Checklist for Small Businesses (2026 Edition)",
  description:
    "A plain-English, 20-point security checklist for small business and startup websites — HTTPS, updates, backups, logins, security headers, forms and what to do if you're hacked.",
  date: "2025-10-20",
  category: "Security",
  tags: ["Security", "Web Security", "Small Business", "Checklist", "WordPress"],
  body: `Most small business sites aren't hacked by a genius targeting them personally. They're hit by bots scanning millions of sites for one old plugin, one reused password or one exposed admin panel. The good news: the defences against that are boring, cheap and mostly one-time work.

I use this checklist for every client site I build or take over. Work through it top to bottom.

## Domain and hosting

1. **Lock your domain.** Turn on registrar lock and two-factor authentication at your domain registrar. Losing the domain means losing email and website at once.
2. **Know who has access.** List every person and agency with hosting, domain, DNS and CMS logins. Remove anyone who no longer needs it — ex-freelancers are a classic hole.
3. **Use managed hosting** or a platform like Vercel or Netlify where the OS is patched for you, unless you have someone who genuinely maintains servers.

## HTTPS everywhere

4. **Serve everything over HTTPS** with an automatic certificate (Let's Encrypt, or your host's built-in one). Redirect all HTTP traffic to HTTPS.
5. **Turn on HSTS** once HTTPS works everywhere, so browsers never try plain HTTP again.

## Updates

6. **Update the CMS, themes and plugins** weekly, or enable automatic updates for minor versions. On WordPress, out-of-date plugins are the number-one way sites get compromised.
7. **Delete what you don't use.** Deactivated plugins and old themes are still attack surface.
8. **Update dependencies** in custom code (\`npm audit\`, Dependabot or Renovate).

## Logins

9. **Unique passwords from a password manager** for every account. See my guide to [password managers, passkeys and 2FA](/articles/passkeys-password-managers-2fa).
10. **Two-factor authentication** on the CMS, hosting, domain, email and payment accounts — authenticator app or passkey, not SMS where you can avoid it.
11. **Limit login attempts** and hide or protect the admin URL (e.g. a login rate limiter plugin, or allow-listing office IPs).
12. **Least privilege**: content writers get Editor, not Administrator.

## Backups

13. **Automatic daily backups, stored somewhere else** than your host — a different provider or cloud bucket.
14. **Test a restore** at least twice a year. A backup you've never restored is a hope, not a backup.
15. **Keep 30 days of history**, so you can go back to before an infection you didn't notice immediately.

## Forms, email and data

16. **Protect forms from spam and abuse** with a honeypot field, rate limiting or Cloudflare Turnstile.
17. **Set up SPF, DKIM and DMARC** on your domain so scammers can't easily send email pretending to be you. Start DMARC at \`p=none\` to monitor, then tighten to \`quarantine\`.
18. **Collect only the data you need**, and know where it's stored. India's Digital Personal Data Protection Act applies to personal data you collect, so treat customer data as a liability as well as an asset.

## Security headers

19. **Add basic security headers.** Even a static site benefits:

\`\`\`text
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
\`\`\`

Add a Content-Security-Policy when you can — it's the strongest defence against injected scripts. Check your site at [securityheaders.com](https://securityheaders.com).

## Monitoring

20. **Know when something's wrong**: an uptime monitor, Google Search Console (it warns about hacked content and malware), and alerts for new admin users or file changes if your platform supports it.

## If you do get hacked

1. Don't panic, and don't just delete random files.
2. Take the site offline or into maintenance mode.
3. Change **every** password: hosting, CMS, database, FTP/SFTP, email.
4. Restore from a clean backup from before the compromise, then update everything.
5. Find how they got in (usually an old plugin or a leaked password), otherwise it will happen again.
6. Request a review in Google Search Console if the site was flagged.

Twenty items sounds like a lot, but most are one-time switches. An afternoon of work closes the doors the bots are knocking on — and you can check your uptime any time on a [status page](/status).`,
})
