import { defineBlog } from "@/content/define"

export default defineBlog({
  slug: "hyprlock-hypridle-setup",
  title: "Hyprlock + Hypridle: Lock Screen, Screen-Off & Suspend on Hyprland",
  description:
    "Set up a lock screen and idle timers on Hyprland: dim, lock, screen off and suspend with hypridle, a clean hyprlock config, lock-on-lid-close, and the Lua-era dpms fix.",
  date: "2026-10-28",
  category: "Linux Desktop",
  tags: ["Hyprland", "hyprlock", "hypridle", "Wayland", "Arch Linux"],
  body: `A fresh Hyprland install has no lock screen and never turns your display off. Walk away and anyone can use your session, and your laptop battery drains with the screen at full brightness. Two small tools from the Hyprland project fix this:

- **hyprlock** draws the lock screen
- **hypridle** watches for inactivity and runs commands (dim → lock → screen off → suspend)

\`\`\`bash
sudo pacman -S hyprlock hypridle brightnessctl
\`\`\`

## Important: these configs are NOT Lua

Hyprland itself [moved to Lua in 0.55](/blogs/hyprland-lua-config-migration), but hyprlock and hypridle still use the classic hyprlang format (\`key = value\`, \`section { }\`). Their files live next to your Hyprland config:

\`\`\`
~/.config/hypr/hyprland.lua    ← Lua
~/.config/hypr/hypridle.conf   ← hyprlang
~/.config/hypr/hyprlock.conf   ← hyprlang
\`\`\`

## The idle plan

A sensible laptop timeline:

| After | Action |
| --- | --- |
| 2.5 min | Dim the screen |
| 5 min | Lock |
| 5.5 min | Turn the display off |
| 30 min | Suspend |

On a desktop, drop the dimming and suspend steps.

## hypridle.conf

\`\`\`ini
general {
    lock_cmd = pidof hyprlock || hyprlock
    before_sleep_cmd = loginctl lock-session
    after_sleep_cmd = hyprctl dispatch 'hl.dsp.dpms({ action = "on" })'
}

# dim
listener {
    timeout = 150
    on-timeout = brightnessctl -s set 10
    on-resume = brightnessctl -r
}

# lock
listener {
    timeout = 300
    on-timeout = loginctl lock-session
}

# screen off
listener {
    timeout = 330
    on-timeout = hyprctl dispatch 'hl.dsp.dpms({ action = "off" })'
    on-resume = hyprctl dispatch 'hl.dsp.dpms({ action = "on" })'
}

# suspend
listener {
    timeout = 1800
    on-timeout = systemctl suspend
}
\`\`\`

What the pieces do:

- **\`lock_cmd\`** runs when anything asks the session to lock (\`loginctl lock-session\`). \`pidof hyprlock ||\` stops two lock screens stacking on top of each other.
- **\`before_sleep_cmd\`** locks *before* suspend, so the screen is already locked when you open the lid.
- **\`brightnessctl -s\` / \`-r\`** saves and restores your brightness, so un-dimming returns to where you were.

### The dpms line every older guide gets wrong

Guides written before 2026 use \`hyprctl dispatch dpms off\`. With a Lua Hyprland config that fails with \`')' expected near 'off'\`, because \`hyprctl dispatch\` now evaluates Lua, so your screen never turns off. Use the \`hl.dsp.dpms({ action = "off" })\` form above. I tested it in a real hypridle config: hyprlang passes the braces and quotes through untouched.

Still on \`hyprland.conf\`? Then the old \`hyprctl dispatch dpms off\` is still correct, but it will break the day you migrate.

## Starting hypridle

Either from your Hyprland config:

\`\`\`lua
hl.on("hyprland.start", function()
    hl.exec_cmd("hypridle")
end)
\`\`\`

…or as a systemd user service:

\`\`\`bash
systemctl --user enable --now hypridle.service
\`\`\`

The service is \`WantedBy=graphical-session.target\`, so it only autostarts if that target is active. That's true with the *Hyprland (uwsm-managed)* session, but often not with the plain one. If you enable the service and it never runs after login, use \`hl.exec_cmd\` instead. (Same root cause as the [screen-sharing portal problem](/blogs/fix-hyprland-screen-sharing).)

## Don't lock during videos and calls

hypridle respects idle inhibitors by default. Firefox and Chrome inhibit idle during fullscreen video, and so do Steam and mpv. To make a window inhibit idle while it's fullscreen, add a Hyprland window rule:

\`\`\`lua
hl.window_rule({
    name  = "no-idle-fullscreen",
    match = { class = ".*" },
    idle_inhibit = "fullscreen",
})
\`\`\`

To pause everything manually (a long download, a presentation):

\`\`\`bash
systemd-inhibit --what=idle --why="presenting" sleep 2h
\`\`\`

## hyprlock.conf

A clean config: blurred screenshot background, clock, date and a password field.

\`\`\`ini
$font = JetBrainsMono Nerd Font

general {
    hide_cursor = true
}

background {
    monitor =
    path = screenshot
    blur_passes = 3
    brightness = 0.6
}

label {
    monitor =
    text = $TIME
    font_size = 96
    font_family = $font
    position = 0, 160
    halign = center
    valign = center
}

label {
    monitor =
    text = cmd[update:60000] date +"%A, %d %B"
    font_size = 20
    font_family = $font
    position = 0, 70
    halign = center
    valign = center
}

input-field {
    monitor =
    size = 300, 56
    outline_thickness = 2
    rounding = 12
    inner_color = rgba(0, 0, 0, 0.3)
    outer_color = rgba(255, 255, 255, 0.3)
    font_color = rgb(230, 230, 230)
    fade_on_empty = false
    placeholder_text = Password…
    fail_text = $PAMFAIL
    position = 0, -40
    halign = center
    valign = center
}
\`\`\`

- \`monitor =\` (empty) means every monitor
- \`path = screenshot\` blurs whatever was on screen, so there's no wallpaper path to maintain
- \`cmd[update:60000]\` re-runs a shell command every 60 s, for anything from the date to battery level

Test it safely before you rely on it. Open a terminal, run \`hyprlock\`, and type your password. If you get stuck, switch to a TTY (\`Ctrl+Alt+F2\`), log in, and run \`pkill hyprlock\`.

## Bind a lock key

\`\`\`lua
hl.bind("SUPER + Escape", hl.dsp.exec_cmd("loginctl lock-session"))
\`\`\`

Using \`loginctl lock-session\` rather than calling \`hyprlock\` directly sends every lock through hypridle's \`lock_cmd\`, so there's one code path to debug.

## Lock when the lid closes

systemd-logind suspends on lid close by default, and \`before_sleep_cmd\` locks first, so this already works. To lock *without* suspending on a docked laptop, edit \`/etc/systemd/logind.conf\`:

\`\`\`ini
[Login]
HandleLidSwitch=suspend
HandleLidSwitchExternalPower=lock
HandleLidSwitchDocked=ignore
\`\`\`

Then \`sudo systemctl restart systemd-logind\`. Save your work first, because restarting logind can end your session. A reboot works too.

## Fingerprint unlock

If your laptop has a supported reader:

\`\`\`bash
sudo pacman -S fprintd
fprintd-enroll
\`\`\`

Then enable it in \`hyprlock.conf\`:

\`\`\`ini
auth {
    fingerprint {
        enabled = true
    }
}
\`\`\`

Password entry still works alongside it.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Screen never turns off | Old \`dpms off\` syntax with a Lua config, see above |
| Screen stays black after resume | Add the \`after_sleep_cmd\` dpms-on line |
| Two lock screens / lock loops | Keep the \`pidof hyprlock\` guard in \`lock_cmd\` |
| Locks during YouTube | Add the \`idle_inhibit\` rule; check the browser isn't blocking inhibitors |
| hypridle not running after login | Start it with \`hl.exec_cmd\` instead of the service |
| Black or garbled screen after suspend on NVIDIA | See the suspend section of my [NVIDIA guide](/blogs/hyprland-nvidia-arch-linux) |

Both files are short and plain text, so they belong in your [dotfiles](/blogs/dotfiles-gnu-stow-git) with the rest of your desktop.`,
})
