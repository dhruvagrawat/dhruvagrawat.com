import { defineArticle } from "@/content/define"

export default defineArticle({
  slug: "client-contracts-scope-creep",
  title: "Client Contracts and Scope Creep: The Processes That Keep an Agency Sane",
  description:
    "What every web project contract should include, how to write a scope clients actually understand, and a simple change-request process that turns scope creep into paid work without damaging the relationship.",
  date: "2026-06-09",
  category: "Agency",
  tags: ["Agency", "Freelancing", "Contracts", "Project Management", "Business"],
  body: `"Can you just add a small login system?" Every developer has heard a version of this a week before launch. Scope creep isn't caused by bad clients — it's caused by vague agreements. Clients genuinely don't know what's hard, and "website" means different things to different people. The fix is a clear contract and a friendly, boring process for changes.

*This is practical experience, not legal advice — have a lawyer review your template once.*

## What every project contract needs

1. **The parties** — your business and the client's, with addresses and GST numbers if applicable.
2. **Scope of work** — a specific list of deliverables (more below).
3. **Timeline** — milestones with dates, and a line that says client delays move those dates.
4. **Fees and payment schedule** — amounts, due dates, late-payment terms.
5. **Revisions** — how many rounds per stage, and what counts as a revision versus a change.
6. **Client responsibilities** — content, images, logins and feedback, with deadlines.
7. **Change requests** — how new work is quoted and approved.
8. **Intellectual property** — ownership transfers to the client **on full payment**; you keep the right to show the work in your portfolio (unless under NDA).
9. **Third-party costs** — hosting, domains, paid plugins and APIs are billed to the client.
10. **Warranty / support period** — e.g. 30 days of bug fixes after launch; new features are separate.
11. **Confidentiality.**
12. **Termination** — how either side can end it, and payment for work done so far.

## Writing a scope clients can understand

Bad: *"A modern, responsive website with an admin panel."*

Good:

| Item | Included |
| --- | --- |
| Pages | Home, About, Services (up to 6), Blog listing + post, Contact |
| Admin | Add/edit blog posts and services; one admin user role |
| Forms | Contact form with email notification and spam protection |
| Integrations | Google Analytics, WhatsApp chat button |
| Not included | Content writing, logo design, payment gateway, multi-language |

The "not included" row is the most valuable line in the document. It turns future arguments into future quotes.

## The change-request process

When a new request comes in:

1. **Acknowledge it warmly.** "Great idea — that'd really help your customers."
2. **Classify it.** Is it a fix (in scope, free), a revision (counts against rounds) or a change (new work)?
3. **Quote it in writing** — a short message with cost and impact on the timeline.
4. **Get a written "yes"** (email or message) before starting.
5. **Add it to the project log and the next invoice.**

A simple template:

\`\`\`text
Hi Priya — happy to add customer logins! That's outside the original
scope, so here's a quick estimate:

• Customer sign-up, login and password reset
• "My bookings" page
• ₹18,000 + GST, adds about 5 working days

Shall I go ahead? We can also do it after launch as phase 2
so the launch date doesn't move.
\`\`\`

Offering **"phase 2"** is the magic move. Most clients care more about launching on time than about the extra feature, and it often becomes your next project.

## Protecting the relationship

- **Say yes to small things occasionally**, on purpose — and mention it: "I've added that one at no charge." Goodwill is part of the price.
- **Never let changes pile up silently.** Five "tiny" unbilled changes breed resentment on your side and surprise on theirs.
- **Document decisions** from calls in a short follow-up message. Memories differ; messages don't.
- **Weekly demos** on a staging link surface misunderstandings early, while they're cheap to fix.

## Getting paid

- Invoice on the milestone date, not "when you get to it".
- Polite reminder on the due date, a firmer one a week later.
- Pause work — calmly and professionally — on significantly overdue payments.
- Keep the production launch, source code handover and domain transfer until the final payment clears.

## Templates worth building once

1. Proposal / quote
2. Contract
3. Project brief questionnaire
4. Change-request message
5. Launch checklist
6. Handover document (credentials, how-to video, support terms)

Build them once, improve them after every project, and a lot of stressful conversations simply stop happening. For the numbers side, see [how to price freelance web projects in India](/articles/pricing-freelance-web-projects-india).`,
})
