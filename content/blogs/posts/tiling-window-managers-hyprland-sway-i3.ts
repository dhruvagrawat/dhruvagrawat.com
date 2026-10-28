import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "tiling-window-managers-hyprland-sway-i3",
  title: "Hyprland vs Sway vs i3: Which Tiling Window Manager?",
  description:
    "An honest comparison of Hyprland, Sway and i3 — what tiling window managers are, who each suits, and a starter config to get going.",
  date: "2026-02-03",
  updated: "2026-10-28",
  category: "Linux Desktop",
  tags: ["Linux", "Hyprland", "Sway", "i3", "Window Manager", "Arch Linux"],
  body: `A tiling window manager arranges your windows for you. Open a terminal and it fills the screen; open a browser and the screen splits in two. No dragging, no overlapping, everything reachable from the keyboard. Once it clicks, going back to floating windows feels like working with oven mitts on.

## Why developers like tiling

- **Keyboard-first**: switch, move and resize windows without touching the mouse
- **Workspaces**: one for code, one for the browser, one for chat — jump with \`Super+1…9\`
- **No wasted pixels**: every window uses the space it's given
- **Plain-text config**: your whole desktop lives in one file you can put in your [dotfiles](/blogs/dotfiles-gnu-stow-git)

The trade-off: you assemble your own desktop. You pick a launcher, a status bar, a notification daemon. That's either the fun part or the reason to stay on GNOME.

## X11 vs Wayland in one paragraph

X11 is the old display system; Wayland is its modern replacement with better security, smooth scaling on HiDPI screens and no screen tearing. In 2026 Wayland is the default on major desktops and works well for most people. i3 is X11-only; Sway and Hyprland are Wayland.

## The three contenders

| | i3 | Sway | Hyprland |
| --- | --- | --- | --- |
| Display server | X11 | Wayland | Wayland |
| Philosophy | Minimal, rock solid | i3, but on Wayland | Eye candy + features |
| Animations & blur | No | No | Yes |
| Config | i3 config | Nearly i3-compatible | Lua (since 0.55) |
| Best for | Old hardware, X11 apps | Stability on Wayland | A polished, modern look |

### i3

The classic. Fast, predictable, and documented to death. If you have older hardware or depend on X11-only tools, it's still a great choice.

### Sway

A drop-in Wayland replacement for i3 — most i3 configs work with small changes. It's deliberately conservative: no animations, focus on correctness. My pick for anyone who wants Wayland without surprises.

### Hyprland

Dynamic tiling with smooth animations, rounded corners, blur and a very active community. It's what you see in most "rice" screenshots. It moves faster than Sway, which means more features and occasionally more breakage after updates. The biggest recent example: version 0.55 (May 2026) replaced the old \`hyprland.conf\` format with a Lua config. My [migration guide](/blogs/hyprland-lua-config-migration) covers it.

## A starter setup on Arch (Hyprland)

\`\`\`bash
sudo pacman -S hyprland kitty waybar wofi mako \\
  xdg-desktop-portal-hyprland polkit-kde-agent \\
  grim slurp wl-clipboard brightnessctl pavucontrol
\`\`\`

- **kitty** — terminal
- **waybar** — status bar
- **wofi** — app launcher
- **mako** — notifications
- **grim + slurp** — screenshots of a region
- **wl-clipboard** — \`wl-copy\` / \`wl-paste\`

A minimal \`~/.config/hypr/hyprland.lua\` (Hyprland 0.55 and newer):

\`\`\`lua
hl.monitor({ output = "", mode = "preferred", position = "auto", scale = 1 })

local mod = "SUPER"

hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("mako")
end)

hl.bind(mod .. " + Return", hl.dsp.exec_cmd("kitty"))
hl.bind(mod .. " + D",      hl.dsp.exec_cmd("wofi --show drun"))
hl.bind(mod .. " + Q",      hl.dsp.window.close())
hl.bind(mod .. " + F",      hl.dsp.window.fullscreen())
hl.bind(mod .. " + V",      hl.dsp.window.float({ action = "toggle" }))

-- move focus with vim keys
hl.bind(mod .. " + H", hl.dsp.focus({ direction = "left" }))
hl.bind(mod .. " + L", hl.dsp.focus({ direction = "right" }))
hl.bind(mod .. " + K", hl.dsp.focus({ direction = "up" }))
hl.bind(mod .. " + J", hl.dsp.focus({ direction = "down" }))

-- workspaces 1–10 (0 = 10)
for i = 1, 10 do
    local key = i % 10
    hl.bind(mod .. " + " .. key,         hl.dsp.focus({ workspace = i }))
    hl.bind(mod .. " + SHIFT + " .. key, hl.dsp.window.move({ workspace = i }))
end

-- screenshot a region to the clipboard
hl.bind("Print", hl.dsp.exec_cmd('grim -g "$(slurp)" - | wl-copy'))
\`\`\`

Log out, choose Hyprland at your display manager (or run \`start-hyprland\` from a TTY), and press \`Super+Enter\`.

## Tips for the first week

1. **Keep a cheat sheet** of your own bindings until muscle memory takes over.
2. **Floating is still allowed** — dialogs and picture-in-picture can float with a rule.
3. **Start small.** Get a terminal, a browser and a launcher working. Theme later.
4. **Read the wiki** — the Hyprland and Sway wikis are excellent, and the Arch Wiki covers the surrounding pieces.

## So which one?

- Want it to never surprise you → **Sway**
- Want it to look gorgeous and don't mind tinkering → **Hyprland**
- On old hardware or stuck on X11 → **i3**

You can install all three side by side and pick at login, so there's no wrong first choice.

## Going deeper

- [Hyprland on NVIDIA (Arch Linux)](/blogs/hyprland-nvidia-arch-linux): drivers, env vars, suspend and hybrid laptops
- [Migrate hyprland.conf to Lua](/blogs/hyprland-lua-config-migration): a cheat sheet for the 0.55+ config
- [Fix Hyprland screen sharing](/blogs/fix-hyprland-screen-sharing): Discord, OBS, Meet and Zoom
- [Hyprlock + Hypridle](/blogs/hyprlock-hypridle-setup): lock screen, screen-off and suspend
- [Migrate from i3 to Sway](/blogs/migrate-i3-to-sway): config changes and X11 tool replacements`,
})
