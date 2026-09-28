import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "keep-arch-linux-stable-btrfs-snapshots",
  title: "Keeping Arch Linux Stable: Btrfs Snapshots, Safe Updates and Recovery",
  description:
    "Arch is only as fragile as your habits. Set up Btrfs snapshots with Snapper and snap-pac, update safely, use the LTS kernel as a fallback, and recover a broken system with arch-chroot.",
  date: "2026-05-11",
  category: "Arch Linux",
  tags: ["Arch Linux", "Btrfs", "Snapper", "Linux", "System Administration"],
  body: `Arch has a reputation for breaking. In practice, most breakage comes from a handful of avoidable habits. With automatic filesystem snapshots and a few rules, Arch can be as dependable as any "stable" distro — and when something does go wrong, you roll back in a minute.

## The habits that prevent 90% of problems

1. **Update regularly** — every week or two. Months-long gaps cause keyring and dependency headaches.
2. **Read the news first.** Manual interventions are announced at [archlinux.org/news](https://archlinux.org/news/). \`paru\` and \`yay\` can show them before upgrading.
3. **Never partially upgrade** — always \`pacman -Syu\`, never \`-Sy package\`. (More in my [pacman cheat sheet](/blogs/pacman-aur-cheat-sheet).)
4. **Handle .pacnew files.** When a config file changes upstream, pacman saves the new one as \`.pacnew\`. Merge them with \`pacdiff\` from \`pacman-contrib\`.
5. **Keep the LTS kernel installed** as a fallback boot option.
6. **Don't update right before something important.** Update when you have ten minutes to fix things.

## Install a fallback kernel

\`\`\`bash
sudo pacman -S linux-lts linux-lts-headers
\`\`\`

With systemd-boot, add a second entry pointing at \`vmlinuz-linux-lts\` and \`initramfs-linux-lts.img\`. If a new kernel ever misbehaves with your GPU or Wi-Fi, reboot into LTS and carry on working.

## Snapshots with Btrfs + Snapper

Btrfs can take instant, space-efficient snapshots of your system. Combined with Snapper and snap-pac, **every pacman transaction automatically creates a before-and-after snapshot**.

This assumes your root filesystem is Btrfs with the common layout (\`@\` for \`/\` and \`@home\` for \`/home\`) — \`archinstall\` sets this up if you choose Btrfs.

\`\`\`bash
sudo pacman -S snapper snap-pac
sudo snapper -c root create-config /
\`\`\`

Keep the number of snapshots sensible in \`/etc/snapper/configs/root\`:

\`\`\`ini
TIMELINE_CREATE="yes"
TIMELINE_LIMIT_HOURLY="5"
TIMELINE_LIMIT_DAILY="7"
TIMELINE_LIMIT_WEEKLY="2"
TIMELINE_LIMIT_MONTHLY="1"
TIMELINE_LIMIT_YEARLY="0"
NUMBER_LIMIT="20"
\`\`\`

\`\`\`bash
sudo systemctl enable --now snapper-timeline.timer snapper-cleanup.timer
\`\`\`

Now run any update and check:

\`\`\`bash
sudo snapper -c root list
\`\`\`

You'll see a \`pre\` and \`post\` pair around the pacman transaction.

### Rolling back

To undo the changes made between two snapshots (for example, a bad update):

\`\`\`bash
sudo snapper -c root undochange 42..43
\`\`\`

For full "boot into an older snapshot from the menu" support, use GRUB with \`grub-btrfs\`, or \`limine\` with its snapper integration — both list snapshots at boot, so you can recover even when the system won't start.

## When it won't boot: arch-chroot

Every Arch user should know this rescue routine. Boot the Arch USB, then:

\`\`\`bash
lsblk                                        # find your partitions
mount /dev/nvme0n1p2 /mnt                    # root (for Btrfs: add -o subvol=@)
mount /dev/nvme0n1p1 /mnt/boot               # EFI partition
arch-chroot /mnt
\`\`\`

You're now "inside" your installed system. Common fixes from here:

\`\`\`bash
pacman -Syu                     # finish an interrupted upgrade
mkinitcpio -P                   # rebuild initramfs images
pacman -S linux                 # reinstall the kernel
bootctl update                  # refresh systemd-boot
\`\`\`

Then \`exit\`, \`umount -R /mnt\`, \`reboot\`.

## Back up what snapshots don't cover

Snapshots live on the same disk. They protect you from bad updates, **not** from a dead SSD or a stolen laptop. Keep a real backup of \`/home\` elsewhere — \`restic\` or \`borg\` to an external drive or cloud storage, on a [systemd timer](/blogs/systemd-services-timers-journalctl).

With snapshots, an LTS fallback and a tested rescue routine, you get Arch's freshness without the fear.`,
})
