import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "fix-hyprland-screen-sharing",
  title: "Fix Hyprland Screen Sharing: Discord, OBS, Google Meet & Zoom",
  description:
    "Screen sharing black, empty or missing on Hyprland? Work through the portal chain step by step — packages, services, the WAYLAND_DISPLAY race, permissions and XWayland apps.",
  date: "2026-10-28",
  category: "Linux Desktop",
  tags: ["Hyprland", "Wayland", "PipeWire", "xdg-desktop-portal", "Arch Linux"],
  body: `On Wayland, apps aren't allowed to read your screen directly, which is good for security and annoying when you need to share your screen in a call in five minutes. Sharing goes through a chain of services, and when any link is missing you get a black window, an empty picker, or a share button that does nothing.

Work through this top to bottom. Each step takes under a minute.

## How screen sharing works on Hyprland

\`\`\`
App (browser, OBS, Discord)
  → xdg-desktop-portal          (the generic portal)
    → xdg-desktop-portal-hyprland (the Hyprland backend + picker)
      → PipeWire                (carries the video stream back to the app)
\`\`\`

Every failure I've seen is one of these links not running, or the wrong backend answering.

## 1. Install the right packages

\`\`\`bash
sudo pacman -S pipewire wireplumber xdg-desktop-portal \\
  xdg-desktop-portal-hyprland xdg-desktop-portal-gtk
\`\`\`

\`xdg-desktop-portal-gtk\` isn't for screen sharing. It provides the file-open dialogs that the Hyprland backend doesn't implement. It's harmless to have, and apps hang on "Open file" without it.

**Remove \`xdg-desktop-portal-wlr\`** if you have it from an old Sway install. It's the most common cause of "the picker never appears", because it can answer instead of the Hyprland backend. Other backends (\`-gnome\`, \`-kde\`) are fine to keep if you also use those desktops. Arch ships \`/usr/share/xdg-desktop-portal/hyprland-portals.conf\`, which tells the portal to prefer Hyprland's backend in a Hyprland session.

## 2. Check the services are actually running

\`\`\`bash
systemctl --user status pipewire wireplumber \\
  xdg-desktop-portal xdg-desktop-portal-hyprland
\`\`\`

All four should be \`active (running)\`. If \`xdg-desktop-portal-hyprland\` says **"condition failed"** or **inactive (dead)**, you've hit the most common problem, step 3.

A quick reset that often fixes it on the spot:

\`\`\`bash
systemctl --user restart xdg-desktop-portal-hyprland xdg-desktop-portal
\`\`\`

## 3. The WAYLAND_DISPLAY race

The Hyprland portal unit has this line:

\`\`\`ini
ConditionEnvironment=WAYLAND_DISPLAY
\`\`\`

If anything asks for the portal *before* Hyprland has exported \`WAYLAND_DISPLAY\` into the systemd user environment, systemd skips the service, and it stays skipped. Something you autostart can do this, and so can a leftover session from your display manager.

Check whether the variable is there:

\`\`\`bash
systemctl --user show-environment | grep -E "WAYLAND_DISPLAY|XDG_CURRENT_DESKTOP"
\`\`\`

You should see \`WAYLAND_DISPLAY=wayland-1\` (or similar) and \`XDG_CURRENT_DESKTOP=Hyprland\`.

Hyprland imports these itself at startup, so the \`dbus-update-activation-environment\` lines many old guides tell you to add are usually redundant. The fixes that actually help:

- **Don't override \`XDG_CURRENT_DESKTOP\`.** Some configs set it to \`GNOME\` or \`sway\` to make an app happy. The portal uses this value to choose its backend, so a wrong value means the wrong backend, or none.
- **Don't set \`HYPRLAND_NO_SD_VARS\`.** It turns off the environment import.
- **Use the uwsm session.** With \`uwsm\` installed, choose **"Hyprland (uwsm-managed)"** at your login screen instead of plain "Hyprland". uwsm starts Hyprland as a proper systemd session, so the environment is set and \`graphical-session.target\` is active before any portal starts. This fixes the race for good.

If you'd rather not use uwsm, a small user target activates \`graphical-session.target\` for a plain session (this is the pattern \`systemd.special(7)\` describes for session targets):

\`\`\`ini
# ~/.config/systemd/user/hyprland-session.target
[Unit]
Description=Hyprland session
BindsTo=graphical-session.target
Wants=graphical-session-pre.target
After=graphical-session-pre.target
\`\`\`

Start it from your Hyprland config:

\`\`\`lua
hl.on("hyprland.start", function()
    hl.exec_cmd("systemctl --user start hyprland-session.target")
end)
\`\`\`

## 4. Hyprland permissions

If you've turned on Hyprland's permission system (\`ecosystem.enforce_permissions = true\`), the portal needs explicit permission to capture the screen. Otherwise sharing silently returns black frames:

\`\`\`lua
hl.permission("/usr/(lib|libexec|lib64)/xdg-desktop-portal-hyprland", "screencopy", "allow")
hl.permission("/usr/(bin|local/bin)/grim", "screencopy", "allow")
\`\`\`

Permission changes need a full Hyprland restart, not a reload.

## 5. Per-app notes

**Firefox.** Works out of the box on Wayland. Share a window or screen and the Hyprland picker appears.

**Chrome / Chromium / Brave.** Chrome has picked Wayland automatically since version 140, so sharing works through the portal out of the box. If an old launcher or \`~/.config/chrome-flags.conf\` forces \`--ozone-platform=x11\`, remove it.

**Electron apps (VS Code, Slack, Obsidian…).** Set \`hl.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")\` so they run natively on Wayland and use the portal.

**OBS Studio.** Add a **Screen Capture (PipeWire)** source, not "Display Capture (XSHM)". If the PipeWire source is missing, the portal isn't running (step 2).

**Discord.** The web version in a Wayland browser is the most reliable. For the desktop app, make sure it runs on Wayland with the Electron hint above. If it runs under XWayland it can only see other XWayland windows.

**Zoom.** Set \`enableWaylandShare=true\` in \`~/.config/zoomus.conf\`, then set *Settings → Share Screen → Advanced → Screen capture mode* to **PipeWire**. Zoom still runs a legacy desktop check, so if sharing is greyed out, launch it with the variable overridden *for Zoom only*: \`XDG_CURRENT_DESKTOP=gnome zoom\`. Don't set that globally (see step 3).

**Any XWayland-only app.** X11 apps can't capture Wayland windows. That's by design, not a bug. Use the app's web version in a Wayland browser, or a native Wayland build if one exists.

## 6. Still black? Read the logs

\`\`\`bash
journalctl --user -b -u xdg-desktop-portal-hyprland -u xdg-desktop-portal
\`\`\`

Typical messages and what they mean:

- \`Condition check resulted in … being skipped\`: the race from step 3
- \`Failed to connect to PipeWire\`: run \`systemctl --user restart pipewire wireplumber\`
- \`Permission denied\` / \`screencopy\`: Hyprland permissions, step 4

On NVIDIA, a black stream with no errors usually means an old driver. Check my [Hyprland on NVIDIA guide](/blogs/hyprland-nvidia-arch-linux). If you need help reading service logs generally, see my [systemd & journalctl guide](/blogs/systemd-services-timers-journalctl).

## Checklist

1. \`xdg-desktop-portal-hyprland\` installed, \`xdg-desktop-portal-wlr\` removed
2. All four user services running
3. \`WAYLAND_DISPLAY\` and \`XDG_CURRENT_DESKTOP=Hyprland\` in \`systemctl --user show-environment\`
4. Use the uwsm session if the portal keeps getting skipped
5. Allow screencopy if you enforce permissions
6. Use PipeWire capture in OBS, and Wayland mode in Chromium and Electron apps`,
})
