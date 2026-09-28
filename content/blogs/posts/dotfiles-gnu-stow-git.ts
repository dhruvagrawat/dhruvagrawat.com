import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "dotfiles-gnu-stow-git",
  title: "Manage Your Dotfiles with GNU Stow and Git (the Simple Way)",
  description:
    "Keep your .bashrc, .zshrc, git, Neovim and terminal configs in one git repo and symlink them anywhere with GNU Stow — set up a new Linux machine in minutes.",
  date: "2026-01-10",
  category: "Tools",
  tags: ["Linux", "Dotfiles", "Git", "GNU Stow", "Productivity"],
  body: `"Dotfiles" are the hidden config files in your home folder — \`.bashrc\`, \`.gitconfig\`, \`~/.config/nvim\` and friends. Over time they become years of small improvements. Losing them with a laptop, or recreating them by hand on every server, is painful. The fix is simple: keep them in a git repo and let **GNU Stow** symlink them into place.

## Why Stow?

There are dozens of dotfile managers. Stow wins because it's tiny, boring and has been around for decades. It does one thing: for each folder in your repo, it creates symlinks in your home directory that mirror the folder's structure. No config language, no magic.

## 1. Create the repo

\`\`\`bash
sudo pacman -S stow      # or: sudo apt install stow
mkdir ~/dotfiles && cd ~/dotfiles
git init
\`\`\`

## 2. One folder per program

Each top-level folder is a "package". Inside it, recreate the path *relative to your home directory*:

\`\`\`text
~/dotfiles
├── bash
│   └── .bashrc
├── git
│   └── .gitconfig
├── nvim
│   └── .config
│       └── nvim
│           └── init.lua
└── kitty
    └── .config
        └── kitty
            └── kitty.conf
\`\`\`

## 3. Move your existing files in

\`\`\`bash
mkdir -p bash git nvim/.config
mv ~/.bashrc bash/
mv ~/.gitconfig git/
mv ~/.config/nvim nvim/.config/
\`\`\`

## 4. Stow them

From inside \`~/dotfiles\`:

\`\`\`bash
stow bash git nvim
\`\`\`

Stow creates \`~/.bashrc → ~/dotfiles/bash/.bashrc\` and so on. Edit the file in either place — it's the same file — and commit when you're happy.

Useful flags:

| Command | What it does |
| --- | --- |
| \`stow -n -v bash\` | Dry run: show what would happen |
| \`stow -D bash\` | Remove that package's symlinks |
| \`stow -R bash\` | Restow (after adding files) |
| \`stow --adopt bash\` | Pull existing files into the repo, then link them |

\`--adopt\` is handy on a new machine that already has default configs — but it overwrites the repo copy with the local file, so check \`git diff\` afterwards.

## 5. Push it

\`\`\`bash
git add .
git commit -m "Initial dotfiles"
git remote add origin git@github.com:you/dotfiles.git
git push -u origin main
\`\`\`

## Setting up a new machine

\`\`\`bash
git clone https://github.com/you/dotfiles.git ~/dotfiles
cd ~/dotfiles
stow */          # every package at once
\`\`\`

Add a small \`install.sh\` that installs your packages too, and a fresh Arch install goes from bare console to "my machine" in one command:

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
sudo pacman -S --needed - < packages.txt
cd "$(dirname "$0")" && stow */
\`\`\`

Generate \`packages.txt\` from your current machine with \`pacman -Qqe > packages.txt\`.

## Don't commit secrets

Dotfiles repos are often public. Never commit API tokens, SSH private keys or \`.netrc\`. Two habits help:

- Put secrets in an untracked file and source it: \`[ -f ~/.secrets ] && . ~/.secrets\`
- Add a \`.gitignore\` in the repo for anything sensitive

If you ever push a secret by accident, **rotate it** — deleting the commit isn't enough, because it may already be cloned or cached.

## Machine-specific tweaks

Keep one shared \`.bashrc\` and source a local override at the end:

\`\`\`bash
[ -f ~/.bashrc.local ] && . ~/.bashrc.local
\`\`\`

The local file stays out of git, so your work laptop and home desktop can differ without branches or templating tools.

That's the whole system. It takes twenty minutes to set up and saves you every time you touch a new computer.`,
})
