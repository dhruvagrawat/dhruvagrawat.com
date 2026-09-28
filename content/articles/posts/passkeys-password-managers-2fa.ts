import { defineArticle } from "@/content/define"

export default defineArticle({
  slug: "passkeys-password-managers-2fa",
  title: "Passkeys, Password Managers and 2FA: Securing Your Digital Life",
  description:
    "Why passwords fail, how password managers and passkeys fix it, which kind of two-factor authentication to use, and a 30-minute plan to lock down your email, bank and work accounts.",
  date: "2025-12-08",
  category: "Security",
  tags: ["Security", "Passkeys", "2FA", "Password Manager", "Privacy"],
  body: `Almost every account takeover I've helped clean up — a founder's email, a client's Instagram, a WordPress admin — came down to the same thing: a reused password that leaked from some other site. Attackers don't guess passwords any more; they take lists of billions of leaked email-and-password pairs and try them everywhere. This is called *credential stuffing*, and it works because people reuse passwords.

Here's how to make yourself a terrible target.

## Step 1: A password manager

A password manager generates and remembers a long, random, unique password for every site. You remember one strong master password; it remembers the rest.

Good options:

| Manager | Notes |
| --- | --- |
| Bitwarden | Open source, generous free plan, works everywhere |
| 1Password | Polished, great for families and teams |
| Proton Pass | Privacy-focused, from the makers of Proton Mail |
| Built-in (Apple / Google) | Fine if you live in one ecosystem |

Your **master password** should be a long passphrase — four or five random words — that you use nowhere else. Turn on 2FA for the manager itself.

Then work through your accounts over a week, replacing old passwords with generated ones. Start with the ones that matter most (below).

## Step 2: Passkeys wherever you can

Passkeys replace passwords entirely. Instead of a secret you type, your device holds a cryptographic key, unlocked with your fingerprint, face or PIN. They're:

- **Phishing-proof** — a passkey only works on the real website it was created for, so a fake login page can't capture it
- **Leak-proof** — the website only stores a public key; there's nothing useful to steal from their database
- **Faster** — one tap instead of typing a password and a code

Google, Apple, Microsoft, GitHub, Amazon, PayPal and many Indian apps now support them. Look for "Passkeys" in the account's security settings. Your password manager or phone can store and sync them across devices.

## Step 3: Two-factor authentication (the right kind)

Where passkeys aren't available, add a second factor. Not all 2FA is equal:

| Method | Strength | Notes |
| --- | --- | --- |
| Security key / passkey | Strongest | Phishing-resistant |
| Authenticator app (TOTP) | Strong | Google Authenticator, Aegis, 2FAS, or your password manager |
| Push approval | Good | Watch out for "MFA fatigue" spam prompts |
| SMS / email code | Weakest | Vulnerable to SIM-swap; still far better than nothing |

**Save your backup codes** when you enable 2FA — in your password manager or printed and kept somewhere safe. Losing your phone shouldn't lock you out forever.

## The 30-minute lockdown plan

Do these first; they protect everything else:

1. **Your primary email** — whoever controls it can reset every other password. Passkey or authenticator 2FA, strong unique password, review recovery phone/email.
2. **Your phone's lock screen** and Apple ID / Google account.
3. **Banking and UPI apps** — use app PINs and biometric locks; never share OTPs with anyone, ever. Banks will never ask.
4. **Your password manager** itself.
5. **Work accounts**: GitHub, cloud consoles (AWS, Vercel, Google Cloud), domain registrar.
6. **Social media**, especially if it's a business account.

## Check if you've been in a breach

Enter your email at [haveibeenpwned.com](https://haveibeenpwned.com). Any account listed there? Change that password, and every account where you reused it.

## Spotting phishing

Passkeys handle most phishing automatically, but stay alert to:

- Urgency: "Your account will be blocked in 2 hours"
- Links that look almost right: \`paypaI.com\`, \`hdfcbank-secure.in\`
- Requests for OTPs, UPI PINs or remote-access apps like AnyDesk
- "KYC update" messages with links — go to the app or official site directly instead

## For teams and agencies

If you run a business, enforce 2FA for everyone on shared tools, use a team password manager instead of spreadsheets or WhatsApp messages, and remove access the day someone leaves. One shared password in a group chat undoes all of the above.

Thirty minutes today saves you from the worst week of your year. Start with your email.`,
})
