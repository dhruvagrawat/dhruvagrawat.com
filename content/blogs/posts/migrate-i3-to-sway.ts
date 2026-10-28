import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "migrate-i3-to-sway",
  title: "Migrate from i3 to Sway: Config Changes & X11 Tool Replacements",
  description:
    "Move your i3 setup to Sway on Arch without starting over: what carries over unchanged, what to rewrite (outputs, input, for_window), and the Wayland replacement for every X11 tool.",
  date: "2026-10-28",
  category: "Linux Desktop",
  tags: ["Sway", "i3", "Wayland", "Arch Linux", "Window Manager"],
  body: `Sway is a Wayland compositor built to accept i3's config format, so moving over is mostly a matter of copying one file. What actually takes time is the *surrounding* tools: xrandr, feh, picom, xclip, i3lock. None of them work on Wayland, and each one has a replacement.

This guide covers both parts. If you're still deciding whether to move at all, see [Hyprland vs Sway vs i3](/blogs/tiling-window-managers-hyprland-sway-i3).

## Install Sway next to i3

You don't have to remove anything. Both can be installed together, and you choose at the login screen.

\`\`\`bash
sudo pacman -S sway swaybg swayidle swaylock waybar \\
  foot fuzzel mako grim slurp wl-clipboard \\
  xdg-desktop-portal-wlr xorg-xwayland
\`\`\`

\`xorg-xwayland\` lets your remaining X11-only apps keep running inside Sway.

## Step 1: copy your config and validate it

\`\`\`bash
mkdir -p ~/.config/sway
cp ~/.config/i3/config ~/.config/sway/config
sway --validate
\`\`\`

\`sway --validate\` (or \`-C\`) parses the config and exits, listing every line it doesn't understand. Fix those and you're most of the way there.

Add this line near the end. Arch's sway package puts a snippet in \`/etc/sway/config.d/\` that exports \`WAYLAND_DISPLAY\` and \`XDG_CURRENT_DESKTOP=sway\` to systemd. Without it, screen sharing and the portal silently fail:

\`\`\`bash
include /etc/sway/config.d/*
\`\`\`

## What carries over unchanged

Almost all the day-to-day config:

- \`set $mod Mod4\` and every \`bindsym\` / \`bindcode\`
- Workspaces, \`workspace_auto_back_and_forth\`, \`assign\`
- \`mode "resize" { … }\` and other modes
- Gaps (\`gaps inner 8\`), borders, \`default_border pixel 2\`
- \`exec\` / \`exec_always\`, \`focus_follows_mouse\`, colours (\`client.focused …\`)
- \`split\`, \`layout tabbed\`, \`floating toggle\`, scratchpad

## What you have to rewrite

### Monitors: xrandr → output

Delete your \`exec xrandr …\` lines. Sway configures outputs itself:

\`\`\`bash
# list connected outputs and their modes
swaymsg -t get_outputs
\`\`\`

\`\`\`bash
output eDP-1   mode 1920x1200@60Hz pos 0 0     scale 1
output DP-1    mode 2560x1440@144Hz pos 1920 0
output *       bg ~/Pictures/wall.jpg fill
\`\`\`

The last line replaces \`feh --bg-fill\`. Sway calls \`swaybg\` for you. For a GUI, install \`wdisplays\` (the Wayland counterpart of arandr).

Fractional scaling works properly here (\`scale 1.25\`). It was hacky on X11.

### Keyboard, mouse & touchpad: setxkbmap/xinput → input

\`\`\`bash
# find device identifiers
swaymsg -t get_inputs
\`\`\`

\`\`\`bash
input type:keyboard {
    xkb_layout us,de
    xkb_options grp:alt_shift_toggle,caps:escape
    repeat_delay 250
    repeat_rate 40
}

input type:touchpad {
    tap enabled
    natural_scroll enabled
    dwt enabled
}
\`\`\`

These replace \`setxkbmap\`, \`xset r rate\` and the \`xinput set-prop\` lines in your \`.xinitrc\`.

### Window matching: class → app_id

Native Wayland apps don't have an X11 \`class\`. They have an \`app_id\`:

\`\`\`bash
# i3
for_window [class="pavucontrol"] floating enable

# sway (native Wayland app)
for_window [app_id="org.pulseaudio.pavucontrol"] floating enable

# sway (app still running under XWayland — class still works)
for_window [class="Steam"] floating enable
\`\`\`

To find the right identifier, focus the window and run:

\`\`\`bash
swaymsg -t get_tree | grep -E '"(app_id|class)"' | sort -u
\`\`\`

The rules that break silently during a migration are almost always \`class\` rules for apps that became native Wayland apps.

### The bar

i3bar's \`bar { status_command i3status }\` block works in Sway, which ships swaybar, and \`i3status\` runs unchanged. Most people move to Waybar for tray icons and styling:

\`\`\`bash
bar {
    swaybar_command waybar
}
\`\`\`

### Scripts: i3-msg → swaymsg

\`swaymsg\` takes the same commands and the same IPC JSON (\`-t get_workspaces\`, \`-t get_tree\`). Usually a search-and-replace is enough:

\`\`\`bash
grep -rln "i3-msg" ~/.config ~/.local/bin | xargs sed -i 's/i3-msg/swaymsg/g'
\`\`\`

Python scripts built on \`i3ipc\` work against Sway as well.

## X11 tool → Wayland replacement

| On i3 / X11 | On Sway / Wayland |
| --- | --- |
| xrandr, arandr | \`output\` in config, \`wdisplays\` |
| feh / nitrogen (wallpaper) | \`output * bg …\` (swaybg) |
| picom / compton | Not needed, Sway composites itself |
| i3lock | \`swaylock\` |
| xss-lock, xautolock | \`swayidle\` |
| dmenu / rofi | \`fuzzel\`, \`wmenu\`, or rofi 2.0+ (which supports Wayland) |
| xclip / xsel | \`wl-copy\` / \`wl-paste\` (wl-clipboard) |
| scrot, maim, flameshot | \`grim\` + \`slurp\` |
| xdotool | \`wtype\` (typing), \`ydotool\` (input), \`swaymsg\` (window control) |
| redshift | \`gammastep\` or \`wlsunset\` |
| dunst | Works on Wayland as-is, or use \`mako\` |
| urxvt / xterm | \`foot\`, \`kitty\`, \`alacritty\` (kitty and alacritty run on both) |
| setxkbmap, xinput, xset | \`input { … }\` blocks |
| .xinitrc / .xprofile | \`exec\` lines in the Sway config |

## Idle and lock (replacing xss-lock + i3lock)

\`\`\`bash
exec swayidle -w \\
    timeout 300 'swaylock -f -c 000000' \\
    timeout 330 'swaymsg "output * power off"' \\
         resume 'swaymsg "output * power on"' \\
    before-sleep 'swaylock -f -c 000000'

bindsym $mod+Escape exec swaylock -f -c 000000
\`\`\`

## Screenshots

\`\`\`bash
bindsym Print exec grim -g "$(slurp)" - | wl-copy
bindsym Shift+Print exec grim ~/Pictures/$(date +%F_%T).png
\`\`\`

## Starting Sway

Choose **Sway** at your display manager, or from a TTY:

\`\`\`bash
sway
\`\`\`

**NVIDIA proprietary driver:** Sway refuses to start on it and tells you to add \`--unsupported-gpu\`. It does run (create a custom session entry with \`Exec=sway --unsupported-gpu\`), but upstream won't help with bugs on that driver. If you're on NVIDIA and want official support, Hyprland is the more comfortable choice. See [Hyprland on NVIDIA](/blogs/hyprland-nvidia-arch-linux).

## Migration checklist

1. Install Sway alongside i3, copy the config, and run \`sway --validate\`
2. Add \`include /etc/sway/config.d/*\`
3. Replace xrandr with \`output\`, and setxkbmap/xinput with \`input\`
4. Check every \`for_window [class=…]\` rule against \`swaymsg -t get_tree\`
5. Swap the X11 tools using the table above
6. \`i3-msg\` → \`swaymsg\` in scripts
7. Keep i3 installed for a week as a fallback, then remove it

Put the new \`~/.config/sway\` into your [dotfiles](/blogs/dotfiles-gnu-stow-git) so your next machine is one \`stow\` away.`,
})
