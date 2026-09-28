import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "first-open-source-contribution",
  title: "Your First Open Source Contribution: A Practical, No-Fear Guide",
  description:
    "How to find a beginner-friendly open source project, pick an issue, fork, branch, commit and open a pull request that maintainers actually want to merge.",
  date: "2026-04-05",
  category: "Open Source",
  tags: ["Open Source", "Git", "GitHub", "Career", "Beginners"],
  body: `Open source runs the world — Linux, Git, React, Node, Postgres, the browser you're reading this in. Contributing back is one of the best ways to get better as a developer: you read production code written by strangers, you get reviewed by experienced maintainers, and you build a public track record. Here's how to do it without the anxiety.

## Contributions that aren't code count

The easiest first contributions are often not code at all:

- Fixing a typo or unclear sentence in the docs
- Adding a missing example to a README
- Reproducing a bug report and adding clear steps
- Translating documentation
- Answering questions in the project's issues or forum

Maintainers value these enormously, and they teach you how the project works.

## Finding the right project

Start with something **you already use**. You understand the problem it solves, and you'll notice its rough edges. Then check a few signals:

| Good sign | Warning sign |
| --- | --- |
| Commits in the last month | No activity for a year |
| Issues get replies | Dozens of unanswered PRs |
| A \`CONTRIBUTING.md\` file | No docs on how to contribute |
| \`good first issue\` labels | Maintainers hostile in comments |

Search GitHub for \`label:"good first issue" language:TypeScript state:open\`, or browse [goodfirstissue.dev](https://goodfirstissue.dev) and [up-for-grabs.net](https://up-for-grabs.net).

## Claim the issue first

Before writing code, comment on the issue: *"I'd like to work on this — my plan is X. Does that sound right?"* This avoids two people doing the same work, and maintainers often reply with pointers that save you hours.

## The workflow

\`\`\`bash
# 1. Fork on GitHub, then clone YOUR fork
git clone git@github.com:you/project.git
cd project

# 2. Track the original repo so you can stay up to date
git remote add upstream https://github.com/owner/project.git

# 3. Always work on a branch
git switch -c fix/typo-in-install-docs

# 4. Follow CONTRIBUTING.md to install and run the tests
npm install
npm test

# 5. Make the change, commit with a clear message
git add -p
git commit -m "docs: fix incorrect flag in install instructions"

# 6. Push to your fork
git push -u origin fix/typo-in-install-docs
\`\`\`

Then open a pull request from your branch on GitHub.

## Writing a PR that gets merged

- **Keep it small.** One fix per PR. A 20-line PR gets reviewed today; a 2,000-line one waits weeks.
- **Link the issue**: "Fixes #123" closes it automatically on merge.
- **Explain the why**, not just the what. What was wrong, how you fixed it, how you tested it.
- **Include screenshots** for anything visual.
- **Match the project's style** — formatting, naming, commit message conventions.
- **Run the tests and linter** before pushing.

A simple template:

\`\`\`markdown
## What
Fixes the install command in the README (the --global flag was wrong).

## Why
Following the current docs fails with "unknown option". Fixes #123.

## How I tested
Ran the corrected command on a clean Ubuntu 24.04 container.
\`\`\`

## Keeping your branch up to date

If the main branch moves on while you wait for review:

\`\`\`bash
git fetch upstream
git rebase upstream/main
git push --force-with-lease
\`\`\`

\`--force-with-lease\` is the safe version of force-push: it refuses if someone else pushed to your branch in the meantime.

## Handling review

Reviews can feel blunt; they're almost never personal. Maintainers are volunteers reviewing dozens of PRs. Reply to each comment, push fixes as new commits (they'll often squash on merge), and say thanks. If a PR is declined, ask what would have made it acceptable — that's still a win.

## Make it a habit

One small contribution a month adds up. After a few merged PRs to the same project you'll understand its codebase, maintainers will recognise your name, and you'll have public, reviewed code to point to in every job interview.`,
})
