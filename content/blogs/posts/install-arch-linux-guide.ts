import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "install-arch-linux-guide",
  title: "How to Install Arch Linux: A Clear, Step-by-Step Guide",
  description:
    "Install Arch Linux on a UEFI machine step by step — partitioning, pacstrap, bootloader, networking and your first user — with every command explained.",
  date: "2025-10-12",
  category: "Arch Linux",
  tags: ["Arch Linux", "Linux", "Installation", "Tutorial"],
  body: `Installing Arch the manual way is the fastest way to actually understand how a Linux system fits together. It looks intimidating, but it's really just a dozen small steps done in order. This guide walks through a clean install on a modern **UEFI** laptop or desktop with a single disk.

> Short on time? The official \`archinstall\` script does all of this through a menu. Read this guide once anyway — when something breaks later, you'll know exactly where to look.

## Before you start

You'll need:

- A USB stick (2 GB or more) and the latest ISO from [archlinux.org/download](https://archlinux.org/download/)
- A wired connection, or your Wi-Fi name and password
- A backup of anything on the target disk — **it will be wiped**

Write the ISO to the USB. On Linux or macOS:

\`\`\`bash
# find your USB device first with lsblk — double-check, this erases it
sudo dd if=archlinux-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
\`\`\`

On Windows, use Rufus (DD mode) or balenaEtcher. Then boot from the USB with **Secure Boot disabled** in your firmware settings.

## 1. Check the boot mode and get online

Confirm you booted in UEFI mode — this command should print \`64\`:

\`\`\`bash
cat /sys/firmware/efi/fw_platform_size
\`\`\`

Ethernet usually just works. For Wi-Fi, use \`iwctl\`:

\`\`\`bash
iwctl
[iwd]# device list
[iwd]# station wlan0 scan
[iwd]# station wlan0 get-networks
[iwd]# station wlan0 connect "Your-Network"
[iwd]# exit

ping -c 3 archlinux.org
timedatectl set-ntp true
\`\`\`

## 2. Partition the disk

Find your disk name with \`lsblk\` — usually \`/dev/nvme0n1\` for NVMe or \`/dev/sda\` for SATA. We'll make two partitions: a 1 GiB EFI partition and one big root partition.

\`\`\`bash
cfdisk /dev/nvme0n1
\`\`\`

Choose **gpt**, then create:

| Partition | Size | Type |
| --- | --- | --- |
| /dev/nvme0n1p1 | 1G | EFI System |
| /dev/nvme0n1p2 | rest of disk | Linux filesystem |

Skip a swap partition — we'll use zram, which is faster and doesn't waste disk.

## 3. Format and mount

\`\`\`bash
mkfs.fat -F 32 /dev/nvme0n1p1
mkfs.ext4 /dev/nvme0n1p2

mount /dev/nvme0n1p2 /mnt
mount --mkdir /dev/nvme0n1p1 /mnt/boot
\`\`\`

Prefer snapshots you can roll back to? Use Btrfs instead of ext4 — see my guide on [keeping Arch stable with Btrfs snapshots](/blogs/keep-arch-linux-stable-btrfs-snapshots).

## 4. Install the base system

Pick fast mirrors first, then install the essentials. Swap \`intel-ucode\` for \`amd-ucode\` if you have an AMD CPU.

\`\`\`bash
reflector --country India --latest 10 --sort rate --save /etc/pacman.d/mirrorlist

pacstrap -K /mnt base linux linux-firmware intel-ucode \\
  networkmanager sudo nano vim man-db git base-devel
\`\`\`

Generate the filesystem table so the system knows what to mount at boot:

\`\`\`bash
genfstab -U /mnt >> /mnt/etc/fstab
\`\`\`

## 5. Configure the new system

Step inside it with \`arch-chroot\`:

\`\`\`bash
arch-chroot /mnt

# time zone and clock
ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime
hwclock --systohc

# locale: uncomment en_US.UTF-8 UTF-8 (and en_IN if you like)
nano /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf

# hostname
echo "archbox" > /etc/hostname

# root password
passwd
\`\`\`

## 6. Install a bootloader

On UEFI, \`systemd-boot\` is the simplest option — it's already part of systemd.

\`\`\`bash
bootctl install
\`\`\`

Create the boot entry. \`blkid\` gives you the root partition's UUID:

\`\`\`bash
blkid -s UUID -o value /dev/nvme0n1p2
\`\`\`

\`\`\`ini
# /boot/loader/entries/arch.conf
title   Arch Linux
linux   /vmlinuz-linux
initrd  /intel-ucode.img
initrd  /initramfs-linux.img
options root=UUID=your-uuid-here rw quiet
\`\`\`

\`\`\`ini
# /boot/loader/loader.conf
default arch.conf
timeout 3
\`\`\`

## 7. Networking, a user and sudo

\`\`\`bash
systemctl enable NetworkManager

useradd -m -G wheel -s /bin/bash dhruv
passwd dhruv

# allow the wheel group to use sudo: uncomment "%wheel ALL=(ALL:ALL) ALL"
EDITOR=nano visudo
\`\`\`

## 8. Reboot

\`\`\`bash
exit
umount -R /mnt
reboot
\`\`\`

Pull out the USB. You should land at a login prompt. Log in as your user and connect to Wi-Fi with \`nmtui\`.

## What to do next

A fresh Arch install is just a console. From here:

1. Install a desktop: \`sudo pacman -S plasma-meta sddm\` or \`gnome gdm\`, then enable the display manager
2. Add compressed RAM swap: \`sudo pacman -S zram-generator\`
3. Set up the AUR helper and learn \`pacman\` properly — see my [pacman and AUR cheat sheet](/blogs/pacman-aur-cheat-sheet)
4. Read the Arch Wiki page for your laptop model — it's the best documentation in the Linux world

## When something goes wrong

Boot the USB again, mount your partitions and \`arch-chroot /mnt\` — you're back inside your system with a working toolset. Nearly every "I broke my Arch" moment is fixable from there.`,
})
