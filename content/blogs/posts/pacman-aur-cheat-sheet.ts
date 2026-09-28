import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "pacman-aur-cheat-sheet",
  title: "pacman and the AUR: The Arch Linux Package Cheat Sheet",
  description:
    "Every pacman command you'll actually use, how to install from the AUR safely with paru or yay, cleaning the cache, fixing keyring errors and rolling back a bad package.",
  date: "2025-11-02",
  category: "Arch Linux",
  tags: ["Arch Linux", "pacman", "AUR", "Cheat Sheet"],
  body: `\`pacman\` looks cryptic because every operation is a single capital letter. Once you know the letters, it's one of the fastest package managers around. Here's everything I use, grouped by what you're trying to do.

## The mental model

- **-S** = sync (install from the repos)
- **-R** = remove
- **-Q** = query what's installed
- **-F** = search files inside packages
- **-U** = install a local package file

Lowercase letters after them are options: \`y\` refresh databases, \`u\` upgrade, \`s\` search or recursive, \`i\` info.

## Everyday commands

| Task | Command |
| --- | --- |
| Update everything | \`sudo pacman -Syu\` |
| Install a package | \`sudo pacman -S firefox\` |
| Search the repos | \`pacman -Ss image editor\` |
| Package details | \`pacman -Si ripgrep\` |
| Remove + unneeded deps | \`sudo pacman -Rns package\` |
| List installed | \`pacman -Q\` |
| Only what you installed | \`pacman -Qe\` |
| Which package owns a file | \`pacman -Qo /usr/bin/ls\` |
| Find the package with a file | \`pacman -F libssl.so\` (run \`sudo pacman -Fy\` once) |

## The one rule: never partially upgrade

Never run \`pacman -Sy package\` on its own. Refreshing the database without upgrading, then installing one package, can pull in a library newer than the rest of your system and break things. Always install with a full upgrade:

\`\`\`bash
sudo pacman -Syu package-name
\`\`\`

## Find and remove orphans

Orphans are dependencies nothing needs any more.

\`\`\`bash
pacman -Qdtq                          # list them
sudo pacman -Rns $(pacman -Qdtq)      # remove them
\`\`\`

## Keep the cache under control

pacman keeps every package version it downloads in \`/var/cache/pacman/pkg\`. That's great for rollbacks, bad for disk space. \`paccache\` (from \`pacman-contrib\`) keeps the last few versions:

\`\`\`bash
sudo pacman -S pacman-contrib
sudo paccache -rk2          # keep the 2 most recent versions
sudo systemctl enable --now paccache.timer   # do it weekly, automatically
\`\`\`

## Make pacman nicer

Edit \`/etc/pacman.conf\` and uncomment or add, under \`[options]\`:

\`\`\`ini
Color
ParallelDownloads = 5
VerbosePkgLists
\`\`\`

(Add \`ILoveCandy\` too if you want Pac-Man in your progress bars.)

## Roll back a broken package

If an update breaks something, reinstall the previous version from the cache:

\`\`\`bash
ls /var/cache/pacman/pkg | grep mesa
sudo pacman -U /var/cache/pacman/pkg/mesa-24.x.x-1-x86_64.pkg.tar.zst
\`\`\`

Then check the [Arch news](https://archlinux.org/news/) and forums — someone usually has the fix within hours.

## Fixing "invalid or corrupted package (PGP signature)"

This almost always means your keyring is out of date, usually after a long break from updating:

\`\`\`bash
sudo pacman -Sy archlinux-keyring
sudo pacman -Su
\`\`\`

## The AUR

The Arch User Repository has community build scripts (PKGBUILDs) for almost everything not in the official repos — VS Code, Spotify, Chrome, niche tools. It's powerful, but **anyone can upload to it**, so read what you install.

### Building by hand (do this once to understand it)

\`\`\`bash
git clone https://aur.archlinux.org/paru-bin.git
cd paru-bin
less PKGBUILD        # read it: where does it download from? what does it run?
makepkg -si
\`\`\`

### With an AUR helper

\`paru\` and \`yay\` wrap pacman and the AUR into one command:

\`\`\`bash
paru -S visual-studio-code-bin    # install from the AUR
paru                              # upgrade repos + AUR together
paru -Sua                         # upgrade only AUR packages
\`\`\`

Both show you the PKGBUILD diff before building — actually read it, especially for packages with few votes or a recent change of maintainer.

## Quick safety checklist

- Update at least every couple of weeks; big gaps cause keyring and dependency pain
- Read the Arch news before large updates (\`paru\` can show it for you)
- Prefer \`-bin\` AUR packages only from maintainers you trust
- Keep the pacman cache or filesystem snapshots so you can always go back

If you want an undo button for the whole system, not just single packages, set up [Btrfs snapshots](/blogs/keep-arch-linux-stable-btrfs-snapshots).`,
})
