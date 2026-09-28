import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "linux-terminal-tricks",
  title: "30 Linux Terminal Tricks That Save Me Hours Every Week",
  description:
    "Keyboard shortcuts, history tricks, brace expansion, xargs, process substitution and more — practical Bash and Zsh tricks that make you dramatically faster in the Linux terminal.",
  date: "2025-11-24",
  category: "Terminal",
  tags: ["Linux", "Terminal", "Bash", "Productivity", "Tips"],
  body: `Most time lost in the terminal isn't in the commands — it's in retyping, scrolling and fixing typos. These are the tricks I use every day. All of them work in Bash, and almost all in Zsh.

## Moving around the line

| Shortcut | What it does |
| --- | --- |
| \`Ctrl+A\` / \`Ctrl+E\` | Jump to start / end of the line |
| \`Alt+B\` / \`Alt+F\` | Move back / forward one word |
| \`Ctrl+W\` | Delete the word before the cursor |
| \`Ctrl+U\` / \`Ctrl+K\` | Delete to start / end of the line |
| \`Ctrl+Y\` | Paste back what you just deleted |
| \`Ctrl+L\` | Clear the screen (keeps what you typed) |
| \`Ctrl+X Ctrl+E\` | Open the current command in your editor |

That last one is a lifesaver for long one-liners: edit comfortably in Vim or nano, save, and it runs.

## History superpowers

1. **\`Ctrl+R\`** — search your history as you type. Press it again to cycle through older matches.
2. **\`!!\`** — the previous command. Forgot sudo? \`sudo !!\`
3. **\`!$\`** — the last argument of the previous command: \`mkdir project && cd !$\`
4. **\`Alt+.\`** — inserts the last argument, and pressing again cycles back through earlier ones
5. **\`^old^new\`** — rerun the last command with a replacement: \`^stagging^staging\`
6. **\`history | grep docker\`** then **\`!123\`** to rerun entry 123

Make history bigger and shared between terminals — add to \`~/.bashrc\`:

\`\`\`bash
HISTSIZE=100000
HISTFILESIZE=200000
HISTCONTROL=ignoreboth:erasedups
shopt -s histappend
PROMPT_COMMAND="history -a; $PROMPT_COMMAND"
\`\`\`

## Expansion tricks

7. **Brace expansion** creates lists without typing them:

\`\`\`bash
mkdir -p app/{components,lib,styles}
cp config.yml{,.bak}          # → cp config.yml config.yml.bak
touch day{01..31}.md
\`\`\`

8. **\`cd -\`** jumps back to the previous directory.
9. **\`**/*\`** matches recursively (\`shopt -s globstar\` in Bash): \`ls **/*.test.ts\`
10. **\`$(...)\`** drops a command's output into another: \`kill $(pgrep -f "node server")\`

## Pipes that do real work

11. **Count things**: \`sort | uniq -c | sort -rn\` — the classic "top N":

\`\`\`bash
# most common status codes in an nginx log
awk '{print $9}' access.log | sort | uniq -c | sort -rn | head
\`\`\`

12. **\`xargs\`** turns lines into arguments; \`-P\` runs them in parallel:

\`\`\`bash
fd -e png | xargs -P 8 -I{} cwebp -q 80 {} -o {}.webp
\`\`\`

13. **\`tee\`** writes to a file and still passes output on — and \`| sudo tee file\` is how you write to root-owned files.
14. **Process substitution** compares command outputs directly:

\`\`\`bash
diff <(ls dir-a) <(ls dir-b)
\`\`\`

15. **\`column -t\`** turns messy whitespace output into a readable table.
16. **\`watch -n 2 'command'\`** reruns anything every two seconds.

## Jobs and processes

17. **\`Ctrl+Z\`** pauses a running program; **\`bg\`** resumes it in the background, **\`fg\`** brings it back.
18. **\`command &> log.txt &\`** runs in the background with all output in a file.
19. **\`nohup\`** or **\`disown\`** keeps it running after you close the terminal.
20. **\`ss -tulpn\`** shows what's listening on which port (the modern \`netstat\`).
21. **\`lsof -i :3000\`** — who is using port 3000?

## Files

22. **\`du -sh * | sort -h\`** — what's eating the disk in this folder.
23. **\`df -h\`** — free space on every mount.
24. **\`tail -f file\`** follows a growing log; \`less +F\` does too, and lets you scroll.
25. **\`rsync -avh --progress src/ dest/\`** — copying that can resume and shows progress.
26. **\`find . -name "*.log" -mtime +7 -delete\`** — clean up old logs.

## Small habits, big payoff

27. **Aliases** for things you type ten times a day:

\`\`\`bash
alias gs='git status -sb'
alias ll='ls -lah'
alias ..='cd ..'
alias please='sudo $(fc -ln -1)'
\`\`\`

28. **A \`mkcd\` function**: \`mkcd() { mkdir -p "$1" && cd "$1"; }\`
29. **\`set -euo pipefail\`** at the top of every Bash script, so errors stop the script instead of silently continuing.
30. **\`tldr command\`** — community-written examples instead of a 40-page man page.

Want to go further? Swap a few classic tools for their faster modern versions — I cover my favourites in [modern CLI tools worth installing](/blogs/modern-cli-tools).`,
})
