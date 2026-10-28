import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "hyprland-nvidia-arch-linux",
  title: "Hyprland on NVIDIA (Arch Linux, 2026): A Setup That Actually Works",
  description:
    "Run Hyprland on an NVIDIA GPU on Arch: picking nvidia-open vs nvidia-580xx, what's already enabled for you, the env vars that matter, suspend, and hybrid laptops.",
  date: "2026-10-28",
  category: "Linux Desktop",
  tags: ["Hyprland", "NVIDIA", "Arch Linux", "Wayland", "Linux"],
  body: `Most "Hyprland + NVIDIA" guides online were written in 2023 and are full of steps you no longer need — and a couple that now do harm. This is the setup I run today on an RTX 4050 laptop with Hyprland 0.56 and the \`nvidia-open\` driver, with every step checked against what current Arch packages actually do.

If you haven't picked a compositor yet, start with my [Hyprland vs Sway vs i3](/blogs/tiling-window-managers-hyprland-sway-i3) comparison.

## Step 1: pick the right driver package

Arch's driver packaging changed in December 2025. NVIDIA's 590 driver dropped support for Pascal (GTX 10-series) and older cards, and Arch's main packages switched to NVIDIA's open kernel modules (\`nvidia\` became \`nvidia-open\`, \`nvidia-dkms\` became \`nvidia-open-dkms\`). Find your GPU with \`lspci | grep -Ei "vga|3d"\`, then:

| Your GPU | Package | Where |
| --- | --- | --- |
| RTX 20 / 30 / 40 / 50, GTX 16-series (Turing and newer) | \`nvidia-open\` or \`nvidia-open-dkms\` | Official repos |
| GTX 10-series and older (Pascal, Maxwell) | \`nvidia-580xx-dkms\` | AUR |
| Anything older | \`nouveau\` (Mesa) | Official repos |

RTX 50-series cards *only* work with the open modules. Use the \`-dkms\` variant if you run more than one kernel — for example the \`linux-lts\` fallback I recommend in [keeping Arch stable](/blogs/keep-arch-linux-stable-btrfs-snapshots).

\`\`\`bash
# Turing and newer, stock kernel
sudo pacman -S nvidia-open nvidia-utils lib32-nvidia-utils libva-nvidia-driver

# or, with several kernels
sudo pacman -S nvidia-open-dkms linux-headers linux-lts-headers \\
  nvidia-utils lib32-nvidia-utils libva-nvidia-driver
\`\`\`

\`lib32-nvidia-utils\` needs the multilib repo (for Steam and Wine). \`libva-nvidia-driver\` gives you hardware video decoding in browsers and mpv.

> **GTX 1060 / 1070 / 1080 owners:** if your desktop went black after an update around Christmas 2025, this is why. Boot to a TTY (\`Ctrl+Alt+F2\`), remove \`nvidia\` / \`nvidia-dkms\`, install \`nvidia-580xx-dkms\` from the AUR with your [AUR helper](/blogs/pacman-aur-cheat-sheet), and reboot.

## Step 2: check what's already done for you

Old guides tell you to add \`nvidia_drm.modeset=1\` and \`nvidia_drm.fbdev=1\` to your kernel command line. Current drivers turn both on by default. Check rather than guess:

\`\`\`bash
cat /sys/module/nvidia_drm/parameters/modeset   # should print Y
cat /sys/module/nvidia_drm/parameters/fbdev     # should print Y
\`\`\`

If either prints \`N\`, add the option in \`/etc/modprobe.d/nvidia.conf\`:

\`\`\`bash
options nvidia_drm modeset=1 fbdev=1
\`\`\`

Arch's \`nvidia-utils\` also ships \`/usr/lib/modprobe.d/nvidia-utils.conf\` (blacklists nouveau, enables kernel suspend notifiers), so you don't need to write any of that yourself.

**Early KMS** (adding \`nvidia nvidia_modeset nvidia_uvm nvidia_drm\` to \`MODULES=()\` in \`/etc/mkinitcpio.conf\`) is optional. Do it only on a desktop where the NVIDIA card drives the screen *and* you see a black screen or a wrong resolution at boot. On a hybrid laptop the Intel/AMD GPU drives the internal display, so leave it out.

## Step 3: environment variables

In Hyprland 0.55+ the config is Lua (\`~/.config/hypr/hyprland.lua\`). If you're still on \`hyprland.conf\`, read my [Lua migration guide](/blogs/hyprland-lua-config-migration) first.

**Desktop, NVIDIA drives the display:**

\`\`\`lua
hl.env("LIBVA_DRIVER_NAME", "nvidia")
hl.env("__GLX_VENDOR_LIBRARY_NAME", "nvidia")
hl.env("NVD_BACKEND", "direct")
hl.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")
\`\`\`

**Hybrid laptop (Intel/AMD + NVIDIA):** set only \`ELECTRON_OZONE_PLATFORM_HINT\`. Setting the first two globally pushes *every* app onto the NVIDIA GPU, which drains the battery and breaks some apps. Run individual apps on the dGPU with \`prime-run\` instead (below).

Things you should **not** set any more:

- \`WLR_NO_HARDWARE_CURSORS\` — deprecated; hardware cursors work
- \`GBM_BACKEND=nvidia-drm\` — not needed with current drivers
- \`XDG_SESSION_TYPE=wayland\` — your session launcher sets it

Check video decoding with \`vainfo\` (from \`libva-utils\`). It should list H.264/HEVC/AV1 profiles under the NVIDIA driver.

## Step 4: suspend and resume

This used to be the worst part of NVIDIA on Linux. With \`nvidia-open\` and Arch's defaults it mostly just works: \`nvidia-utils\` sets \`NVreg_UseKernelSuspendNotifiers=1\`, and with the open modules that handles saving video memory across suspend automatically.

On the legacy \`nvidia-580xx\` driver you still need the old setup:

\`\`\`bash
# /etc/modprobe.d/nvidia-power.conf
options nvidia NVreg_PreserveVideoMemoryAllocations=1 NVreg_TemporaryFilePath=/var/tmp
\`\`\`

\`\`\`bash
sudo systemctl enable nvidia-suspend.service nvidia-hibernate.service nvidia-resume.service
\`\`\`

If you wake up to corrupted windows or a frozen screen, that's the first place to look: \`journalctl -b -1 | grep -i nvidia\` shows what happened in the previous boot. (More on reading logs in my [systemd and journalctl guide](/blogs/systemd-services-timers-journalctl).)

## Step 5: hybrid laptops

Most gaming laptops have two GPUs. The integrated one runs the desktop and the NVIDIA one wakes up on demand.

**Run an app on the NVIDIA GPU:**

\`\`\`bash
sudo pacman -S nvidia-prime
prime-run steam
prime-run blender
\`\`\`

\`nvidia-smi\` lists which processes are using the dGPU right now. Useful when the fans won't stop.

**Switching modes.** [EnvyControl](https://github.com/bayasdev/envycontrol) (AUR: \`envycontrol\`) switches between \`integrated\` (dGPU off, best battery), \`hybrid\` (default) and \`nvidia\` (dGPU drives everything). I keep mine on hybrid and use \`prime-run\` for games.

**External monitors.** On many laptops the HDMI port is wired directly to the NVIDIA GPU. If an external screen feels laggy in hybrid mode, every frame is being copied between GPUs. Either switch to \`nvidia\` mode while docked, or tell Hyprland which GPU to prefer with \`AQ_DRM_DEVICES\`. Card numbers (\`/dev/dri/card0\`, \`card1\`) can swap between boots, and the stable \`/dev/dri/by-path/\` names contain colons, which this variable uses as a separator. So create stable symlinks with a udev rule (the PCI addresses come from \`lspci\`):

\`\`\`bash
# /etc/udev/rules.d/99-gpu-names.rules
KERNEL=="card*", KERNELS=="0000:00:02.0", SUBSYSTEM=="drm", SUBSYSTEMS=="pci", SYMLINK+="dri/igpu"
KERNEL=="card*", KERNELS=="0000:01:00.0", SUBSYSTEM=="drm", SUBSYSTEMS=="pci", SYMLINK+="dri/dgpu"
\`\`\`

\`\`\`lua
-- first entry is the primary renderer
hl.env("AQ_DRM_DEVICES", "/dev/dri/dgpu:/dev/dri/igpu")
\`\`\`

## Troubleshooting cheat sheet

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Black screen after an update, GTX 10-series | 590 dropped Pascal | Switch to \`nvidia-580xx-dkms\` |
| Hyprland exits straight back to login | Driver module not loaded | Check \`lsmod\` lists \`nvidia_drm\`; for \`-dkms\`, check headers match your kernel |
| Driver gone after a kernel update | DKMS build failed | \`sudo pacman -S linux-headers\`, then \`dkms status\` |
| Flicker in XWayland apps / games | Old driver or old Hyprland | Update both — explicit sync fixed this |
| Battery drains fast on a laptop | Apps forced onto dGPU | Remove global \`__GLX_VENDOR_LIBRARY_NAME\`, use \`prime-run\` |
| Laggy external monitor | Cross-GPU copying | \`nvidia\` mode while docked, or \`AQ_DRM_DEVICES\` |
| Screen sharing shows black | Portal issue, not NVIDIA | See my [screen sharing fix](/blogs/fix-hyprland-screen-sharing) |

## The short version

1. Install the package that matches your GPU generation.
2. Verify modeset/fbdev are \`Y\` instead of copy-pasting kernel parameters.
3. Desktop: four env vars. Laptop: one, and \`prime-run\` for the rest.
4. Suspend is handled on \`nvidia-open\`; the old services are only for \`580xx\`.

NVIDIA on Wayland went from "don't" to "boring" over the last two years, and boring is what you want from a GPU driver.`,
})
