import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "ssh-tips-config-keys-tunnels",
  title: "SSH Like a Pro: Keys, ~/.ssh/config, Tunnels and Hardening",
  description:
    "Use ed25519 keys, ~/.ssh/config shortcuts, jump hosts and port forwarding like a pro — then harden your server's SSH daemon.",
  date: "2026-07-19",
  category: "Linux",
  tags: ["Linux", "SSH", "Security", "DevOps", "Tips"],
  body: `SSH is the tool every developer uses daily and few people configure. A few minutes of setup turns \`ssh -i ~/.ssh/key.pem ubuntu@13.235.x.x -p 2222\` into \`ssh prod\` — and makes your servers much harder to break into.

## 1. Use a modern key

\`\`\`bash
ssh-keygen -t ed25519 -C "you@laptop"
\`\`\`

Ed25519 keys are short, fast and secure. **Always set a passphrase**, then let the agent remember it so you only type it once per session:

\`\`\`bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
\`\`\`

Copy your public key to a server:

\`\`\`bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
\`\`\`

## 2. Stop typing: ~/.ssh/config

\`\`\`ini
# ~/.ssh/config
Host *
    AddKeysToAgent yes
    IdentitiesOnly yes
    ServerAliveInterval 30
    ServerAliveCountMax 4

Host prod
    HostName 13.235.10.20
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519

Host staging
    HostName staging.example.com
    User deploy

Host github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
\`\`\`

Now \`ssh prod\`, \`scp file prod:/tmp/\` and \`rsync -avh ./dist/ prod:/var/www/\` all just work. \`ServerAliveInterval\` stops idle sessions from being dropped by flaky Wi-Fi or NAT.

## 3. Jump hosts (bastions)

Private servers are often reachable only through a bastion. One line handles it:

\`\`\`ini
Host db-internal
    HostName 10.0.1.15
    User admin
    ProxyJump prod
\`\`\`

\`ssh db-internal\` hops through \`prod\` automatically. One-off: \`ssh -J prod admin@10.0.1.15\`.

## 4. Port forwarding (tunnels)

**Local forwarding** — reach a remote service as if it were on your laptop. Great for a database that isn't exposed to the internet:

\`\`\`bash
ssh -N -L 5433:localhost:5432 prod
# now connect your DB client to localhost:5433
\`\`\`

**Remote forwarding** — show a local dev server to someone through a server you control:

\`\`\`bash
ssh -N -R 8080:localhost:3000 prod
\`\`\`

**Dynamic (SOCKS) proxy** — route your browser through the server:

\`\`\`bash
ssh -N -D 1080 prod
\`\`\`

\`-N\` means "don't open a shell, just tunnel". Add \`-f\` to send it to the background.

## 5. Reuse connections

Opening many SSH sessions to the same host (git, scp, several terminals)? Multiplexing makes every connection after the first instant:

\`\`\`ini
Host *
    ControlMaster auto
    ControlPath ~/.ssh/cm-%r@%h:%p
    ControlPersist 10m
\`\`\`

## 6. Harden the server

On the server, edit \`/etc/ssh/sshd_config\` (or add a file in \`/etc/ssh/sshd_config.d/\`):

\`\`\`ini
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3
\`\`\`

**Before restarting, keep your current session open** and test from a second terminal — if you've made a mistake, you can still fix it:

\`\`\`bash
sudo sshd -t                     # check the config for errors
sudo systemctl restart sshd      # "ssh" on Debian/Ubuntu
\`\`\`

Then add a firewall and brute-force protection:

\`\`\`bash
sudo ufw allow OpenSSH
sudo ufw enable
sudo apt install fail2ban        # bans IPs after repeated failures
\`\`\`

Changing the port from 22 doesn't add real security, but it does cut log noise from bots dramatically.

## 7. Handy extras

- \`ssh prod 'df -h'\` — run one command and exit
- \`~.\` (tilde, then dot) — kill a frozen session
- \`ssh-keygen -R hostname\` — remove an old host key after a server rebuild
- \`sshfs prod:/var/log ~/remote-logs\` — mount a remote folder locally

Put your \`~/.ssh/config\` (never your private keys!) in your [dotfiles repo](/blogs/dotfiles-gnu-stow-git) and every machine you own gets the same shortcuts.`,
})
