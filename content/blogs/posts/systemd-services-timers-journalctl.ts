import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "systemd-services-timers-journalctl",
  title: "systemd for Developers: Services, Timers and journalctl Explained",
  description:
    "Run your app as a systemd service that restarts on crash, replace cron with systemd timers, and read logs like a pro with journalctl — a practical guide with copy-paste unit files.",
  date: "2026-03-01",
  category: "Linux",
  tags: ["Linux", "systemd", "DevOps", "Servers", "Tutorial"],
  body: `If you deploy anything to a Linux server — a Node API, a Python worker, a bot — you'll eventually want it to start on boot, restart when it crashes and keep its logs somewhere sensible. That's exactly what systemd does, and you only need three pieces of it: **services**, **timers** and **journalctl**.

## The commands you'll use constantly

| Command | What it does |
| --- | --- |
| \`systemctl status app\` | Is it running? Last few log lines |
| \`sudo systemctl start app\` / \`stop\` / \`restart\` | Control it now |
| \`sudo systemctl enable --now app\` | Start now and on every boot |
| \`sudo systemctl daemon-reload\` | Reload after editing a unit file |
| \`systemctl list-units --failed\` | What's broken? |
| \`journalctl -u app -f\` | Follow the service's logs |

## Turn your app into a service

Say you have a Node API in \`/opt/myapi\`. Create a dedicated user so it doesn't run as root:

\`\`\`bash
sudo useradd --system --home /opt/myapi --shell /usr/sbin/nologin myapi
sudo chown -R myapi: /opt/myapi
\`\`\`

Then write \`/etc/systemd/system/myapi.service\`:

\`\`\`ini
[Unit]
Description=My API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=myapi
WorkingDirectory=/opt/myapi
ExecStart=/usr/bin/node server.js
EnvironmentFile=/etc/myapi.env
Restart=on-failure
RestartSec=3

# basic hardening — cheap and effective
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/opt/myapi/data
ProtectHome=true

[Install]
WantedBy=multi-user.target
\`\`\`

Secrets go in \`/etc/myapi.env\` (\`chmod 600\`), one \`KEY=value\` per line — not in the unit file and not in git.

\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapi
systemctl status myapi
\`\`\`

Kill the process and watch systemd bring it back three seconds later. That's \`Restart=on-failure\` doing its job.

## Replace cron with timers

Timers need two files, but you get logging, missed-run catch-up and easy status for free.

\`\`\`ini
# /etc/systemd/system/backup.service
[Unit]
Description=Nightly database backup

[Service]
Type=oneshot
User=backup
ExecStart=/usr/local/bin/backup-db.sh
\`\`\`

\`\`\`ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Run backup every night

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true
RandomizedDelaySec=5min

[Install]
WantedBy=timers.target
\`\`\`

\`\`\`bash
sudo systemctl enable --now backup.timer
systemctl list-timers          # when does everything run next?
sudo systemctl start backup    # run it right now to test
\`\`\`

\`Persistent=true\` means if the server was off at 02:30, the job runs as soon as it boots. \`OnCalendar\` accepts friendly values too: \`daily\`, \`weekly\`, \`Mon..Fri 09:00\`. Test an expression with \`systemd-analyze calendar "Mon..Fri 09:00"\`.

## journalctl: logs without hunting for files

Everything your service prints to stdout/stderr lands in the journal.

\`\`\`bash
journalctl -u myapi -f                 # follow live
journalctl -u myapi --since "1 hour ago"
journalctl -u myapi -p err             # errors only
journalctl -b -1 -p warning            # warnings from the previous boot
journalctl -u myapi -o json-pretty -n 5
journalctl --disk-usage
sudo journalctl --vacuum-time=14d      # trim old logs
\`\`\`

## User services (no sudo needed)

On your own machine, you can run services as yourself — great for dev servers, syncing scripts or a local bot. Put units in \`~/.config/systemd/user/\` and add \`--user\`:

\`\`\`bash
systemctl --user enable --now syncthing
journalctl --user -u syncthing -f
\`\`\`

## Debugging a service that won't start

1. \`systemctl status app\` — read the last lines, they usually say why
2. \`journalctl -u app -n 50 --no-pager\` — more context
3. Run the exact \`ExecStart\` command by hand as the service user: \`sudo -u myapi /usr/bin/node server.js\`
4. \`systemd-analyze verify /etc/systemd/system/app.service\` catches typos in the unit file

That's 90% of systemd a developer needs. Services keep things running, timers replace cron, and the journal answers "what happened?".`,
})
