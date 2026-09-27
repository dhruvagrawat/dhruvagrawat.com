/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DATA } from "@/data/resume";
import { Pixel, spriteDataUrl, type SpriteName } from "./pixel-art";
import "./retro.css";

/* =========================================================
   Types & helpers
   ========================================================= */

type DialogButton = { label: string; action?: () => void };
type Dialog = {
  id: number;
  title: string;
  icon: SpriteName;
  body: ReactNode;
  buttons: DialogButton[];
  x: number;
  y: number;
};
type OpenDialog = Omit<Dialog, "id" | "x" | "y">;

const SECTIONS = [
  { id: "r-about", label: "About Me" },
  { id: "r-work", label: "Work" },
  { id: "r-education", label: "Education" },
  { id: "r-skills", label: "Skillz" },
  { id: "r-projects", label: "Projects" },
  { id: "r-guestbook", label: "Guestbook" },
  { id: "r-links", label: "Cool Links" },
] as const;

const BOOT_STEPS = [
  "Dialing 0-800-DHRUV...",
  "Verifying username and password...",
  "Registering your computer on the network...",
  "Connected at 56,000 bps. Loading homepage...",
];

const socials = Object.values(DATA.contact.social).filter((s) => s.navbar);

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function visitorCount() {
  // One "visit" every 20 minutes since 1 Jan 1999 — always going up, always 7 digits.
  const n = Math.floor((Date.now() - Date.UTC(1999, 0, 1)) / (20 * 60 * 1000));
  return String(n % 10_000_000).padStart(7, "0");
}

/* =========================================================
   Main component
   ========================================================= */

export default function RetroSite() {
  const router = useRouter();
  const [booting, setBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [counter, setCounter] = useState("0000000");
  const [status, setStatus] = useState("Opening page http://www.dhruvagrawat.com/~dhruv/...");
  const [clock, setClock] = useState("");
  const [avatarOk, setAvatarOk] = useState(true);
  const nextId = useRef(1);
  const scrollerRef = useRef<HTMLDivElement>(null);

  /* ---------- dialogs ---------- */
  const openDialog = useCallback((d: OpenDialog) => {
    const id = nextId.current++;
    setDialogs((prev) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(380, vw - 32);
      const cascade = (prev.length % 5) * 26;
      const x = Math.max(16, Math.round((vw - w) / 2) + cascade - 40);
      const y = Math.max(16, Math.round(vh * 0.2) + cascade);
      // keep at most 5 popups on screen — close the oldest
      const kept = prev.length >= 5 ? prev.slice(1) : prev;
      return [...kept, { ...d, id, x, y }];
    });
    setActiveId(id);
  }, []);

  const closeDialog = useCallback((id: number) => {
    setDialogs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const moveDialog = useCallback((id: number, x: number, y: number) => {
    setDialogs((prev) => prev.map((d) => (d.id === id ? { ...d, x, y } : d)));
  }, []);

  const goBackTo2026 = useCallback(() => {
    openDialog({
      title: "Time Machine",
      icon: "warning",
      body: (
        <>
          <b>Are you sure you want to return to 2026?</b>
          <br />
          Things there have rounded corners, dark mode and 400 MB of
          JavaScript. There is no dial-up tone.
        </>
      ),
      buttons: [{ label: "Yes, take me back", action: () => router.push("/") }, { label: "No, stay in 1999" }],
    });
  }, [openDialog, router]);

  /* ---------- boot sequence ---------- */
  const finishBoot = useCallback(() => {
    setBooting(false);
    try {
      sessionStorage.setItem("r99-booted", "1");
    } catch {
      /* private mode etc. — just replay next time */
    }
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("r99-booted") === "1";
    } catch {
      /* ignore */
    }
    if (seen) {
      setBooting(false);
      return;
    }
    const timers = BOOT_STEPS.map((_, i) => setTimeout(() => setBootStep(i), i * 650));
    timers.push(setTimeout(finishBoot, BOOT_STEPS.length * 650 + 300));
    return () => timers.forEach(clearTimeout);
  }, [finishBoot]);

  /* ---------- after boot: counter, clock, welcome popups ---------- */
  useEffect(() => {
    if (booting) return;
    setCounter(visitorCount());
    const tick = () =>
      setClock(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tick();
    const clockTimer = setInterval(tick, 30_000);
    const statusTimer = setTimeout(() => setStatus("Done"), 900);

    const welcome = setTimeout(() => {
      openDialog({
        title: "Welcome!",
        icon: "info",
        body: (
          <>
            <b>Welcome to {DATA.name.split(" ")[0]}&apos;s Home Page!!!</b>
            <br />
            You have successfully travelled back to 1999. Please do not pick up
            the phone — you&apos;ll disconnect the internet.
          </>
        ),
        buttons: [{ label: "OK" }],
      });
    }, 700);

    const prize = setTimeout(() => {
      openDialog({
        title: "Congratulations!!!",
        icon: "star",
        body: (
          <>
            <span className="r99-blink" style={{ color: "#c00", fontWeight: "bold" }}>
              *** YOU ARE A WINNER ***
            </span>
            <br />
            You are visitor #{Number(visitorCount()).toLocaleString()}! Your prize: a
            freelance developer who actually replies to email.
          </>
        ),
        buttons: [
          {
            label: "Claim Prize",
            action: () => {
              window.location.href = `mailto:${DATA.contact.email}?subject=${encodeURIComponent(
                "I won the prize on your 1999 website"
              )}`;
            },
          },
          { label: "Cancel" },
        ],
      });
    }, 14_000);

    return () => {
      clearInterval(clockTimer);
      clearTimeout(statusTimer);
      clearTimeout(welcome);
      clearTimeout(prize);
    };
  }, [booting, openDialog]);

  /* ---------- retro mouse cursor ---------- */
  const cursor = `${spriteDataUrl("arrow", 2)} 0 0, auto`;

  /* ---------- desktop icons ---------- */
  const desktopIcons: { icon: SpriteName; label: string; onClick: () => void }[] = [
    {
      icon: "computer",
      label: "My Computer",
      onClick: () =>
        openDialog({
          title: "System Properties",
          icon: "computer",
          body: (
            <div className="r99-mono" style={{ fontSize: 12 }}>
              <b>{DATA.name}</b>
              <br />
              Full-Stack Engineer 99 SE
              <br />
              <br />
              Location: {DATA.location}
              <br />
              Freelance builds: 30+ web apps
              <br />
              Main languages: {DATA.skills.slice(0, 4).map((s) => s.name).join(", ")}
              <br />
              Uptime: since {DATA.work[DATA.work.length - 1].start}
            </div>
          ),
          buttons: [{ label: "OK" }],
        }),
    },
    { icon: "folder", label: "My Projects", onClick: () => scrollToId("r-projects") },
    { icon: "notepad", label: "about_me.txt", onClick: () => scrollToId("r-about") },
    {
      icon: "envelope",
      label: "Outbox",
      onClick: () => (window.location.href = `mailto:${DATA.contact.email}`),
    },
    {
      icon: "bin",
      label: "Recycle Bin",
      onClick: () =>
        openDialog({
          title: "Recycle Bin",
          icon: "bin",
          body: (
            <>
              The Recycle Bin contains <b>4 items</b>:
              <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                <li>flexbox.css</li>
                <li>dark-mode.js</li>
                <li>rounded-corners.png</li>
                <li>node_modules (3.2 GB)</li>
              </ul>
            </>
          ),
          buttons: [{ label: "Empty Recycle Bin" }, { label: "Close" }],
        }),
    },
    { icon: "floppy", label: "Back to 2026", onClick: goBackTo2026 },
  ];

  /* ---------- project "files" ---------- */
  const openProject = (p: (typeof DATA.projects)[number]) =>
    openDialog({
      title: `${p.title} - Properties`,
      icon: "folder",
      body: (
        <div>
          <b style={{ fontSize: 13 }}>{p.title}</b>
          <div style={{ color: "#555", margin: "2px 0 8px" }}>Created: {p.dates}</div>
          <div>{p.description}</div>
          <div style={{ marginTop: 8 }}>
            <b>Built with:</b> {p.technologies.join(", ")}
          </div>
          {p.href && (
            <div style={{ marginTop: 8 }}>
              <a href={p.href} target="_blank" rel="noopener noreferrer">
                Open project &raquo;
              </a>
            </div>
          )}
        </div>
      ),
      buttons: [{ label: "OK" }],
    });

  /* ---------- guestbook ---------- */
  const signGuestbook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "A mysterious visitor");
    const msg = String(f.get("message") || "");
    const subject = `Guestbook entry from ${name}`;
    window.location.href = `mailto:${DATA.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(msg)}`;
    openDialog({
      title: "Guestbook",
      icon: "heart",
      body: (
        <>
          Thanks for signing my guestbook, <b>{name}</b>!!! Your email program
          should open now. If it didn&apos;t, write to{" "}
          <a href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a>.
        </>
      ),
      buttons: [{ label: "OK" }],
    });
  };

  /* ---------- menu bar easter eggs ---------- */
  const menuMsg = (title: string, body: ReactNode) => () =>
    openDialog({ title, icon: "info", body, buttons: [{ label: "OK" }] });

  const firstName = DATA.name.split(" ")[0];
  const smallAvatar = DATA.avatarUrl.startsWith("https://github.com/")
    ? `${DATA.avatarUrl}?size=40`
    : DATA.avatarUrl;

  return (
    <div className="r99" ref={scrollerRef} style={{ cursor }}>
      {booting && (
        <div className="r99-boot" role="dialog" aria-label="Connecting">
          <div className="r99-window">
            <div className="r99-titlebar">
              <Pixel name="globe" size={16} />
              <span className="r99-title">Dial-up Connection</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Pixel name="computer" size={40} />
                <span className="r99-bounce" style={{ letterSpacing: 2 }}>
                  · · · ·
                </span>
                <Pixel name="globe" size={40} />
              </div>
              <p style={{ margin: "14px 0 8px" }}>{BOOT_STEPS[bootStep]}</p>
              <div className="r99-progress" aria-hidden>
                {Array.from({ length: Math.round(((bootStep + 1) / BOOT_STEPS.length) * 30) }).map(
                  (_, i) => (
                    <i key={i} />
                  )
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                <button className="r99-xpbtn" onClick={finishBoot}>
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="r99-desktop">
        {/* ----- desktop icons (wide screens only) ----- */}
        <div className="r99-icons">
          {desktopIcons.map((d) => (
            <button key={d.label} className="r99-icon" onClick={d.onClick} onDoubleClick={d.onClick}>
              <Pixel name={d.icon} size={36} />
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        {/* ----- browser window ----- */}
        <div className="r99-window">
          <div className="r99-titlebar">
            <Pixel name="globe" size={16} />
            <span className="r99-title">
              {firstName}&apos;s Home Page - Web Explorer 5.0
            </span>
            <button
              className="r99-tbtn"
              aria-label="Minimize"
              onClick={menuMsg(
                "Minimize",
                "Nice try. There's nowhere to minimize to — this is the only website on the internet."
              )}
            >
              _
            </button>
            <button
              className="r99-tbtn"
              aria-label="Maximize"
              onClick={menuMsg(
                "Maximize",
                "This window is already at the maximum resolution of 800x600. Please upgrade your monitor."
              )}
            >
              □
            </button>
            <button className="r99-tbtn close" aria-label="Close" onClick={goBackTo2026}>
              ✕
            </button>
          </div>

          <div className="r99-menubar" role="menubar">
            {[
              ["File", "Save As... is disabled. Please print this page and keep it in a binder."],
              ["Edit", "Edit what? This page was hand-coded in Notepad. It is perfect."],
              ["View", "Best viewed at 800x600 in 256 colours with your speakers turned up."],
              ["Favorites", "Added to Favorites! (Bookmarking is also accepted: dhruvagrawat.com)"],
              ["Tools", `Tools I actually use: ${DATA.skills.map((s) => s.name).join(", ")}.`],
              ["Help", "For help, sign the guestbook at the bottom of the page. I check it daily."],
            ].map(([label, msg]) => (
              <button key={label} role="menuitem" onClick={menuMsg(label, msg)}>
                <u>{label[0]}</u>
                {label.slice(1)}
              </button>
            ))}
          </div>

          <div className="r99-toolbar">
            <button className="r99-tool" onClick={goBackTo2026} title="Back to 2026">
              <span className="glyph">◄</span> Back
            </button>
            <button
              className="r99-tool"
              onClick={menuMsg("Forward", "You can't go forward from here. The future hasn't been invented yet.")}
            >
              <span className="glyph">►</span>
            </button>
            <button
              className="r99-tool"
              onClick={() => {
                setStatus("Stopped.");
                setTimeout(() => setStatus("Done"), 1200);
              }}
            >
              <span className="glyph stop">✕</span>
            </button>
            <button
              className="r99-tool"
              onClick={() => {
                try {
                  sessionStorage.removeItem("r99-booted");
                } catch {
                  /* ignore */
                }
                window.location.reload();
              }}
            >
              <span className="glyph plain">↻</span> Refresh
            </button>
            <button
              className="r99-tool"
              onClick={() => scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span className="glyph plain">⌂</span> Home
            </button>
            <span className="sep" />
            <a className="r99-tool" href={`mailto:${DATA.contact.email}`}>
              <Pixel name="envelope" size={18} /> Mail
            </a>
          </div>

          <div className="r99-address">
            <span className="label">Address</span>
            <span className="field">
              <Pixel name="globe" size={14} />
              http://www.dhruvagrawat.com/~dhruv/index.htm
            </span>
            <button className="r99-btn" style={{ minHeight: 20, padding: "0 8px" }} onClick={() => setStatus("Done")}>
              Go
            </button>
          </div>

          {/* ===================== THE 1999 HOMEPAGE ===================== */}
          <div className="r99-page">
            <header>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 6 }}>
                <Pixel name="star" size={14} className="r99-blink" />
                <span className="r99-comic" style={{ color: "#ff99ff", fontSize: 14 }}>
                  ~*~ welcome 2 my homepage ~*~
                </span>
                <Pixel name="star" size={14} className="r99-blink" />
              </div>
              <h1 className="r99-wordart">{DATA.name}</h1>
              <p className="r99-subtitle r99-comic">
                ~*~ Full-Stack Software Engineer ~*~ Freelancer ~*~ Startup Builder ~*~
              </p>
              <div className="r99-marquee r99-mono" aria-label="News ticker">
                <span>
                  *** WELCOME TO MY HOMEPAGE!!! *** Currently based in {DATA.location} ***
                  Available for freelance projects - sign my guestbook!!! *** 30+ web apps
                  shipped *** This site is Y2K compliant *** Best viewed at 800x600 ***
                </span>
              </div>
            </header>

            <div className="r99-layout">
              {/* ----- left "frame" ----- */}
              <aside className="r99-sidebar">
                <div className="r99-box">
                  <div className="h">
                    <Pixel name="folder" size={16} /> Navigation
                  </div>
                  <nav className="body r99-nav" style={{ padding: 6 }}>
                    {SECTIONS.map((s) => (
                      <button key={s.id} className="r99-btn" onClick={() => scrollToId(s.id)}>
                        {s.label}
                      </button>
                    ))}
                    <button className="r99-btn" onClick={goBackTo2026}>
                      « Back to 2026
                    </button>
                  </nav>
                </div>

                <div className="r99-box" style={{ textAlign: "center" }}>
                  <div className="h">Hit Counter</div>
                  <div className="body" style={{ fontSize: 13 }}>
                    You are visitor #
                    <div style={{ marginTop: 6 }}>
                      <span className="r99-counter" aria-label={`visitor ${counter}`}>
                        {counter.split("").map((d, i) => (
                          <span key={i}>{d}</span>
                        ))}
                      </span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 11, color: "#555" }}>
                      since Jan 1, 1999
                    </div>
                  </div>
                </div>

                <div className="r99-construction" role="note">
                  <Pixel name="cone" size={22} />
                  <b>UNDER CONSTRUCTION</b>
                  <Pixel name="cone" size={22} />
                </div>
              </aside>

              {/* ----- main "frame" ----- */}
              <main style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                {/* ABOUT */}
                <section id="r-about" className="r99-box" style={{ scrollMarginTop: 8 }}>
                  <h2>
                    <Pixel name="notepad" size={16} /> about_me.txt
                  </h2>
                  <div className="body" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center", flex: "none" }}>
                      {avatarOk ? (
                        <img
                          src={smallAvatar}
                          alt={`Scanned photo of ${DATA.name}`}
                          className="r99-photo"
                          onError={() => setAvatarOk(false)}
                        />
                      ) : (
                        <div className="r99-photo" style={{ display: "grid", placeItems: "center" }}>
                          <Pixel name="computer" size={72} title={DATA.name} />
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: "#555" }}>
                        (scanned at 72 dpi)
                      </div>
                    </div>
                    <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                      <p style={{ marginTop: 0 }}>
                        <b className="r99-comic" style={{ color: "#c00", fontSize: 18 }}>
                          Hi!!! I&apos;m {firstName}!
                        </b>{" "}
                        {DATA.description}
                      </p>
                      <p>{DATA.summary}</p>
                      <p style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: 6 }}>
                        <Pixel name="globe" size={18} className="r99-spin" />
                        <span>
                          Beaming in from <b>{DATA.location}</b>
                        </span>
                      </p>
                    </div>
                  </div>
                </section>

                {/* WORK */}
                <section id="r-work" className="r99-box" style={{ scrollMarginTop: 8 }}>
                  <h2>
                    <Pixel name="computer" size={16} /> Work Experience
                  </h2>
                  <div className="body" style={{ padding: 6 }}>
                    <table className="r99-table">
                      <thead>
                        <tr>
                          <th>When</th>
                          <th>Where I Worked</th>
                          <th className="hide-sm">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DATA.work.map((w) => (
                          <tr key={w.company + w.start}>
                            <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                              {w.start}
                              <br />– {w.end}
                            </td>
                            <td>
                              <b>{w.company}</b>
                              {w.end === "Present" && <span className="r99-new">NOW!</span>}
                              <br />
                              <i>{w.title}</i>
                              <div style={{ fontSize: 13, marginTop: 4 }}>{w.description}</div>
                            </td>
                            <td className="hide-sm" style={{ fontSize: 13 }}>
                              {w.location}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* EDUCATION */}
                <section id="r-education" className="r99-box" style={{ scrollMarginTop: 8 }}>
                  <h2>
                    <Pixel name="floppy" size={16} /> Education
                  </h2>
                  <div className="body">
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
                      {DATA.education.map((e) => (
                        <li key={e.school} style={{ display: "flex", gap: 8 }}>
                          <Pixel name="star" size={14} className="r99-spin" />
                          <span>
                            <b>{e.school}</b> ({e.start}–{e.end})
                            <br />
                            {e.degree}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* SKILLS */}
                <section id="r-skills" className="r99-box" style={{ scrollMarginTop: 8 }}>
                  <h2>
                    <Pixel name="star" size={14} /> My Skillz
                  </h2>
                  <div className="body">
                    <p style={{ marginTop: 0 }} className="r99-comic">
                      Stuff I know how 2 use:
                    </p>
                    <div className="r99-badges" style={{ justifyContent: "flex-start" }}>
                      {DATA.skills.map((s, i) => (
                        <span
                          key={s.name}
                          className="r99-badge"
                          style={{
                            background: BADGE_COLORS[i % BADGE_COLORS.length][0],
                            color: BADGE_COLORS[i % BADGE_COLORS.length][1],
                            gap: 4,
                          }}
                        >
                          <s.icon style={{ width: 14, height: 14, flex: "none" }} />
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* PROJECTS */}
                <section id="r-projects" className="r99-box" style={{ scrollMarginTop: 8 }}>
                  <h2>
                    <Pixel name="folder" size={16} /> C:\My Documents\Projects
                    <span className="r99-new">NEW!</span>
                  </h2>
                  <div className="body">
                    <p style={{ marginTop: 0, fontSize: 14 }}>
                      Click a folder to see what&apos;s inside. {DATA.projects.length} object(s).
                    </p>
                    <div className="r99-files">
                      {DATA.projects.map((p) => (
                        <button key={p.title} className="r99-file" onClick={() => openProject(p)}>
                          <Pixel name="folder" size={40} />
                          <span className="name">{p.title}</span>
                          <span className="meta">{p.dates}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* GUESTBOOK */}
                <section id="r-guestbook" className="r99-box" style={{ scrollMarginTop: 8 }}>
                  <h2>
                    <Pixel name="envelope" size={16} /> Sign My Guestbook!!!
                  </h2>
                  <div className="body">
                    <p style={{ marginTop: 0 }}>
                      Want to work together, or just say hi? Leave a message and it
                      will fly straight to my inbox via e-mail. You can also write to{" "}
                      <a href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a>.
                    </p>
                    <form onSubmit={signGuestbook} style={{ display: "grid", gap: 8, maxWidth: 460 }}>
                      <label style={{ display: "grid", gap: 2, fontSize: 14 }}>
                        Your Name:
                        <input name="name" className="r99-field" maxLength={60} />
                      </label>
                      <label style={{ display: "grid", gap: 2, fontSize: 14 }}>
                        Your Message:
                        <textarea name="message" rows={4} className="r99-field" required />
                      </label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="submit" className="r99-btn">
                          Submit
                        </button>
                        <button type="reset" className="r99-btn">
                          Reset
                        </button>
                      </div>
                    </form>
                  </div>
                </section>

                {/* LINKS */}
                <section id="r-links" className="r99-box" style={{ scrollMarginTop: 8 }}>
                  <h2>
                    <Pixel name="globe" size={16} /> Cool Links
                  </h2>
                  <div className="body">
                    <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
                      {socials.map((s) => (
                        <li key={s.name}>
                          <a href={s.url} target="_blank" rel="noopener noreferrer">
                            {s.name}
                          </a>{" "}
                          - follow me here!!
                        </li>
                      ))}
                      <li>
                        <a href="/">dhruvagrawat.com (2026 edition)</a> - the boring modern version
                      </li>
                    </ul>
                  </div>
                </section>
              </main>
            </div>

            <hr className="r99-hr" />

            <footer style={{ textAlign: "center", display: "grid", gap: 12 }}>
              <div className="r99-webring">
                <a href={DATA.contact.social.GitHub.url} target="_blank" rel="noopener noreferrer">
                  &laquo; Prev
                </a>
                {"  |  "}
                <span style={{ color: "#ffcc00" }}>~ The Indie Developer WebRing ~</span>
                {"  |  "}
                <a href={DATA.contact.social.LinkedIn.url} target="_blank" rel="noopener noreferrer">
                  Next &raquo;
                </a>
              </div>

              <div className="r99-badges">
                {FOOTER_BADGES.map(([label, bg, fg]) => (
                  <span key={label} className="r99-badge" style={{ background: bg, color: fg }}>
                    {label}
                  </span>
                ))}
              </div>

              <p className="r99-comic" style={{ margin: 0, fontSize: 14 }}>
                Made with{" "}
                <Pixel name="heart" size={12} className="r99-bounce" /> and Notepad by{" "}
                {DATA.name}. &copy; 1999&ndash;{new Date().getFullYear()}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>
                This page is best viewed with a CRT monitor at 800x600 and 256 colours.
              </p>
              <div>
                <button className="r99-btn" onClick={goBackTo2026}>
                  <Pixel name="floppy" size={14} /> Back to 2026
                </button>
              </div>
            </footer>
          </div>

          <div className="r99-statusbar">
            <div>
              <Pixel name="globe" size={12} /> {status}
            </div>
            <div>Internet</div>
            {clock && <div>{clock}</div>}
          </div>
        </div>
      </div>

      {/* ----- popups ----- */}
      {dialogs.map((d) => (
        <RetroDialog
          key={d.id}
          dialog={d}
          active={d.id === activeId}
          onFocus={() => setActiveId(d.id)}
          onClose={() => closeDialog(d.id)}
          onMove={(x, y) => moveDialog(d.id, x, y)}
        />
      ))}
    </div>
  );
}

const BADGE_COLORS: [string, string][] = [
  ["#000080", "#ffff00"],
  ["#008000", "#ffffff"],
  ["#800000", "#ffcc00"],
  ["#c0c0c0", "#000080"],
  ["#ff6600", "#000000"],
  ["#660099", "#66ffff"],
];

const FOOTER_BADGES: [string, string, string][] = [
  ["Made with Notepad", "#c0c0c0", "#000"],
  ["Y2K Compliant", "#008000", "#fff"],
  ["HTML 3.2 Valid", "#000080", "#ff0"],
  ["56k Modem Ready", "#800000", "#fc0"],
  ["Best at 800x600", "#000", "#0f0"],
  ["No Frames Used*", "#660099", "#6ff"],
];

/* =========================================================
   Draggable XP dialog
   ========================================================= */

function RetroDialog({
  dialog,
  active,
  onFocus,
  onClose,
  onMove,
}: {
  dialog: Dialog;
  active: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const firstBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstBtn.current?.focus({ preventScroll: true });
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    onFocus();
    drag.current = { dx: e.clientX - dialog.x, dy: e.clientY - dialog.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 40;
    onMove(
      Math.min(maxX, Math.max(-200, e.clientX - drag.current.dx)),
      Math.min(maxY, Math.max(0, e.clientY - drag.current.dy))
    );
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div
      className={`r99-dialog${active ? "" : " inactive"}`}
      style={{ left: dialog.x, top: dialog.y, zIndex: active ? 42 : 40 }}
      role="alertdialog"
      aria-label={dialog.title}
      onPointerDown={onFocus}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="r99-titlebar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Pixel name={dialog.icon} size={16} />
        <span className="r99-title">{dialog.title}</span>
        <button className="r99-tbtn close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="content">
        <div style={{ flex: "none" }}>
          <Pixel name={dialog.icon} size={32} />
        </div>
        <div style={{ minWidth: 0 }}>{dialog.body}</div>
      </div>
      <div className="actions">
        {dialog.buttons.map((b, i) => (
          <button
            key={b.label}
            ref={i === 0 ? firstBtn : undefined}
            className="r99-xpbtn"
            onClick={() => {
              onClose();
              b.action?.();
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
