import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "modern-cli-tools",
  title: "12 Modern CLI Tools That Replace the Classics (and Why)",
  description:
    "ripgrep, fd, bat, eza, fzf, zoxide, btop, dust, jq, delta, tldr and lazygit — faster, friendlier replacements for grep, find, cat, ls and friends, with install commands and my config.",
  date: "2025-12-15",
  category: "Tools",
  tags: ["Linux", "CLI", "Tools", "Productivity", "Open Source"],
  body: `The classic Unix tools are brilliant, but many were designed in the 1970s. A new generation — mostly written in Rust and Go — keeps the same ideas while being faster, colourful and sensible by default. These are the ones that earned a permanent place on my machines.

Install them all on Arch in one go:

\`\`\`bash
sudo pacman -S ripgrep fd bat eza fzf zoxide btop dust jq git-delta tldr lazygit
\`\`\`

(On Ubuntu/Debian most are in apt too; note that \`fd\` is \`fd-find\` and \`bat\` is \`batcat\` there.)

## 1. ripgrep (\`rg\`) — instead of grep

Recursively searches the current folder, respects \`.gitignore\`, skips binaries, and is extremely fast.

\`\`\`bash
rg "useEffect"                 # search everything
rg -t ts "TODO"                # only TypeScript files
rg -l "api_key"                # just list matching files
rg -C 2 "panic"                # with 2 lines of context
\`\`\`

## 2. fd — instead of find

Simple syntax, sensible defaults, also respects \`.gitignore\`.

\`\`\`bash
fd config                 # names containing "config"
fd -e md                  # all Markdown files
fd -H -t d node_modules   # include hidden, only directories
\`\`\`

## 3. bat — instead of cat

Syntax highlighting, line numbers and git change markers. It also makes a great pager for man pages:

\`\`\`bash
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
\`\`\`

## 4. eza — instead of ls

Colours, icons, git status and a tree view built in.

\`\`\`bash
alias ls='eza --group-directories-first'
alias ll='eza -lah --git --group-directories-first'
alias tree='eza --tree --level=2'
\`\`\`

## 5. fzf — fuzzy find anything

The single biggest productivity boost on this list. It turns any list into an interactive fuzzy search. Enable the shell integration and you get:

- \`Ctrl+R\` — fuzzy history search
- \`Ctrl+T\` — fuzzy-pick a file and paste its path
- \`Alt+C\` — fuzzy \`cd\` into a subfolder

\`\`\`bash
# ~/.bashrc  (or: source <(fzf --zsh) in ~/.zshrc)
eval "$(fzf --bash)"
export FZF_DEFAULT_COMMAND='fd --type f --hidden --exclude .git'
\`\`\`

Pipe anything into it: \`git branch | fzf | xargs git checkout\`.

## 6. zoxide — a smarter cd

It remembers where you go. Type part of a folder name and it jumps to the best match.

\`\`\`bash
eval "$(zoxide init bash --cmd cd)"   # replace cd itself
cd dhruv      # → ~/code/dhruvagrawat.com, if that's where you usually go
cdi           # interactive picker with fzf
\`\`\`

## 7. btop — instead of top/htop

A beautiful resource monitor with CPU, memory, disks, network and processes on one screen, fully mouse-driven.

## 8. dust — instead of du

Shows at a glance which folders are eating your disk, as a tree with bars. Just run \`dust\` in any directory.

## 9. jq — JSON on the command line

Essential for working with APIs:

\`\`\`bash
curl -s https://api.github.com/repos/torvalds/linux | jq '.stargazers_count'
cat package.json | jq '.dependencies | keys'
\`\`\`

## 10. delta — beautiful git diffs

Syntax-highlighted, side-by-side diffs everywhere git shows them:

\`\`\`ini
# ~/.gitconfig
[core]
    pager = delta
[interactive]
    diffFilter = delta --color-only
[delta]
    navigate = true
    side-by-side = true
\`\`\`

## 11. tldr — man pages, but useful

\`tldr tar\` shows the five commands you actually wanted, instead of the full manual.

## 12. lazygit — git in a terminal UI

Stage individual lines, rebase interactively, resolve conflicts and browse history with single keystrokes. It's the one tool I show people that makes them install it on the spot.

## Should you alias the classics away?

I alias \`ls\` and \`cat\` but **not** \`grep\` or \`find\`: scripts, Stack Overflow answers and servers all assume the originals. Learn both — use the modern ones interactively, keep the classics for scripts.

Next step: keep all these aliases and configs in one place with [dotfiles managed by GNU Stow](/blogs/dotfiles-gnu-stow-git).`,
})
