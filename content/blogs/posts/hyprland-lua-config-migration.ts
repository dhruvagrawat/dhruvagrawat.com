import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "hyprland-lua-config-migration",
  title: "Hyprland Lua Config: Migrate hyprland.conf to hyprland.lua",
  description:
    "Hyprland 0.55 moved to Lua configs and hyprlang is being dropped. A side-by-side cheat sheet for binds, rules, exec-once and env, plus the hyprctl dispatch gotcha.",
  date: "2026-10-28",
  category: "Linux Desktop",
  tags: ["Hyprland", "Lua", "Wayland", "Arch Linux", "Dotfiles"],
  body: `Hyprland 0.55 (May 2026) replaced the old \`hyprland.conf\` syntax ("hyprlang") with a Lua config. The old format still loads for now, but upstream has said it will be kept for only one or two releases after 0.55 and won't get any new features. Since 0.56 the example config ships in Lua only. If your dotfiles are still \`.conf\`, now is the time to move.

This is the cheat sheet I wish I'd had when I converted mine.

## How Hyprland picks a config

- If \`~/.config/hypr/hyprland.lua\` exists, it's loaded and \`hyprland.conf\` is **ignored**.
- If there's no \`.lua\` file, \`hyprland.conf\` loads as before.
- The check happens **once at startup**, so switching formats needs a full restart, not \`hyprctl reload\`.

That gives you a safe way to migrate. Write \`hyprland.lua\` next to your old file and restart. If something is badly broken, switch to a TTY (\`Ctrl+Alt+F2\`), rename it to \`hyprland.lua.off\` and you're back on your old config.

Only Hyprland itself moved. **hyprlock, hypridle and hyprpaper still use the hyprlang format**, so leave those files alone. (My [hyprlock + hypridle guide](/blogs/hyprlock-hypridle-setup) has current configs.)

## The cheat sheet

| hyprland.conf | hyprland.lua |
| --- | --- |
| \`$terminal = kitty\` | \`local terminal = "kitty"\` |
| \`source = ~/.config/hypr/binds.conf\` | \`require("binds")\` |
| \`env = XCURSOR_SIZE,24\` | \`hl.env("XCURSOR_SIZE", "24")\` |
| \`monitor = , preferred, auto, 1\` | \`hl.monitor({ output = "", mode = "preferred", position = "auto", scale = 1 })\` |
| \`general { gaps_in = 5 }\` | \`hl.config({ general = { gaps_in = 5 } })\` |
| \`exec-once = waybar\` | \`hl.exec_cmd("waybar")\` inside \`hl.on("hyprland.start", …)\` |
| \`bind = $mod, Return, exec, kitty\` | \`hl.bind(mod .. " + Return", hl.dsp.exec_cmd("kitty"))\` |
| \`killactive\` | \`hl.dsp.window.close()\` |
| \`togglefloating\` | \`hl.dsp.window.float({ action = "toggle" })\` |
| \`fullscreen\` | \`hl.dsp.window.fullscreen()\` |
| \`movefocus, l\` | \`hl.dsp.focus({ direction = "left" })\` |
| \`workspace, 3\` | \`hl.dsp.focus({ workspace = 3 })\` |
| \`movetoworkspace, 3\` | \`hl.dsp.window.move({ workspace = 3 })\` |
| \`togglespecialworkspace, magic\` | \`hl.dsp.workspace.toggle_special("magic")\` |
| \`togglesplit\` | \`hl.dsp.layout("togglesplit")\` |
| \`exit\` | \`hl.dsp.exit()\` |
| \`bindel = …\` | \`hl.bind(…, { locked = true, repeating = true })\` |
| \`bindm = $mod, mouse:272, movewindow\` | \`hl.bind(mod .. " + mouse:272", hl.dsp.window.drag(), { mouse = true })\` |

Two Lua basics trip everyone up at first. Strings need quotes, and \`..\` joins strings (\`mod .. " + Q"\`). Comments start with \`--\`, not \`#\`.

## Autostart: exec-once becomes an event

There's no \`exec-once\` keyword. Instead you run commands when Hyprland fires its start event:

\`\`\`lua
hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("mako")
    hl.exec_cmd("wl-paste --type text --watch cliphist store")
end)
\`\`\`

\`hl.exec_cmd\` starts the process asynchronously, so you don't need \`& disown\`. The same \`hl.on\` mechanism handles other events too (\`"window.open"\`, \`"window.title"\`), which you couldn't do in hyprlang without an external script.

## Keybinds: loops instead of 20 lines

The nicest win is that the config is real code. Ten workspace binds and ten move-to-workspace binds become one loop:

\`\`\`lua
local mod = "SUPER"

for i = 1, 10 do
    local key = i % 10 -- workspace 10 is on the 0 key
    hl.bind(mod .. " + " .. key,         hl.dsp.focus({ workspace = i }))
    hl.bind(mod .. " + SHIFT + " .. key, hl.dsp.window.move({ workspace = i }))
end
\`\`\`

Binds can also call a function, so the conditional logic that used to live in shell scripts can sit in the config:

\`\`\`lua
hl.bind(mod .. " + X", function()
    -- toggle floating on the focused window, from inside Lua
    hl.dispatch(hl.dsp.window.float({ action = "toggle" }))
end)
\`\`\`

## Window rules

The old one-liners like \`windowrule = float, class:^(pavucontrol)$\` become tables with a \`match\` block:

\`\`\`lua
hl.window_rule({
    name  = "float-audio-mixer",
    match = { class = "^(org.pulseaudio.pavucontrol)$" },
    float = true,
    size  = "(monitor_w*0.5) (monitor_h*0.6)",
    center = true,
})

hl.window_rule({
    name  = "pip",
    match = { title = "^(Picture-in-Picture)$" },
    float = true,
    pin   = true,
})
\`\`\`

Rules return a handle, so you can switch them on and off at runtime with \`rule:set_enabled(false)\`.

## A complete starter hyprland.lua

\`\`\`lua
hl.monitor({ output = "", mode = "preferred", position = "auto", scale = "auto" })

local terminal = "kitty"
local menu     = "wofi --show drun"
local mod      = "SUPER"

hl.env("XCURSOR_SIZE", "24")

hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("mako")
end)

hl.config({
    general    = { gaps_in = 5, gaps_out = 10, border_size = 2, layout = "dwindle" },
    decoration = { rounding = 8 },
    input      = { kb_layout = "us", follow_mouse = 1 },
})

hl.bind(mod .. " + Return", hl.dsp.exec_cmd(terminal))
hl.bind(mod .. " + D",      hl.dsp.exec_cmd(menu))
hl.bind(mod .. " + Q",      hl.dsp.window.close())
hl.bind(mod .. " + F",      hl.dsp.window.fullscreen())
hl.bind(mod .. " + V",      hl.dsp.window.float({ action = "toggle" }))

for dir, key in pairs({ left = "H", right = "L", up = "K", down = "J" }) do
    hl.bind(mod .. " + " .. key, hl.dsp.focus({ direction = dir }))
end

for i = 1, 10 do
    local key = i % 10
    hl.bind(mod .. " + " .. key,         hl.dsp.focus({ workspace = i }))
    hl.bind(mod .. " + SHIFT + " .. key, hl.dsp.window.move({ workspace = i }))
end

hl.bind(mod .. " + mouse:272", hl.dsp.window.drag(),   { mouse = true })
hl.bind(mod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })

hl.bind("Print", hl.dsp.exec_cmd('grim -g "$(slurp)" - | wl-copy'))
\`\`\`

Split it up as it grows. Put \`binds.lua\`, \`rules.lua\` and \`env.lua\` in \`~/.config/hypr/\` and \`require\` them from \`hyprland.lua\`. Then the whole folder goes into your [dotfiles repo](/blogs/dotfiles-gnu-stow-git).

## The gotcha that breaks scripts: hyprctl dispatch

With a Lua config, \`hyprctl dispatch\` evaluates **Lua**. Anything in your scripts, Waybar modules or hypridle config that uses the old syntax now fails:

\`\`\`bash
$ hyprctl dispatch dpms on
error: [string "return hl.dispatch(dpms on)"]:1: ')' expected near 'on'

 → Note: dispatch in lua is a shorthand for hl.dispatch(...), your syntax might need to be updated.
\`\`\`

The fix is to pass a dispatcher expression:

\`\`\`bash
hyprctl dispatch 'hl.dsp.dpms({ action = "on" })'
hyprctl dispatch 'hl.dsp.focus({ workspace = 2 })'
hyprctl dispatch 'hl.dsp.exit()'
\`\`\`

Grep your setup for leftovers:

\`\`\`bash
grep -rn "hyprctl dispatch" ~/.config ~/.local/bin 2>/dev/null
\`\`\`

There's also a new \`hyprctl eval\` that runs arbitrary Lua in the running compositor, which is handy for testing a snippet before it goes in the file.

## Converter tools

Community converters exist: \`hyprlang2lua\` (AUR), \`hyprconf2lua\` (PyPI) and the \`hyprlang-to-lua.nvim\` Neovim plugin. They're a decent first pass for a big config, but none of them are official, and their own authors say to expect manual cleanup. For a typical config of under 200 lines, rewriting by hand with the table above is faster, and you'll understand the result.

## Checklist

1. Back up: \`cp -r ~/.config/hypr ~/.config/hypr.bak\`
2. Write \`hyprland.lua\` next to the old \`hyprland.conf\`
3. Restart Hyprland (log out and back in), fix any errors it reports
4. Update every \`hyprctl dispatch\` call in scripts and hypridle
5. Leave \`hyprlock.conf\`, \`hypridle.conf\` and \`hyprpaper.conf\` as they are
6. Delete \`hyprland.conf\` once you've lived with the new one for a week

Running NVIDIA? The env vars section of my [Hyprland on NVIDIA guide](/blogs/hyprland-nvidia-arch-linux) already uses the Lua syntax.`,
})
