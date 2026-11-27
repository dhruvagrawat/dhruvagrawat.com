"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Ellipsis, FolderGit2, Home, LayoutGrid, Menu, X } from "lucide-react";
import { DATA } from "@/data/resume";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type NavItem = (typeof DATA.navbar)[number];
const isMore = (i: NavItem) => "more" in i && i.more;
const MAIN = DATA.navbar.filter((i) => !isMore(i));
const MORE = DATA.navbar.filter(isMore);
const SOCIALS = Object.entries(DATA.contact.social).filter(([, s]) => s.navbar);

function useIsActive() {
  const path = usePathname() ?? "/";
  return (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));
}

export default function Navbar() {
  return (
    <nav aria-label="Main">
      <div className="hidden sm:block">
        <DesktopNavbar />
      </div>
      <div className="sm:hidden">
        <MobileNavbar />
      </div>
    </nav>
  );
}

/* ===================== DESKTOP ===================== */

function DesktopNavbar() {
  const isActive = useIsActive();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
      <Dock className="z-50 pointer-events-auto relative h-14 p-2 w-fit mx-auto flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
        {MAIN.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link href={item.href} aria-label={item.label} aria-current={isActive(item.href) ? "page" : undefined}>
                <DockIcon
                  className={cn(
                    "relative rounded-3xl size-full border transition-colors hover:text-foreground hover:bg-muted",
                    isActive(item.href) ? "bg-muted text-foreground" : "bg-background text-muted-foreground"
                  )}
                >
                  <item.icon className="size-full" />
                  {isActive(item.href) && <span aria-hidden className="absolute -bottom-1.5 size-1 rounded-full bg-primary" />}
                </DockIcon>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{item.label}</p>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        ))}

        {/* everything else, with labels */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger aria-label="More pages">
                <DockIcon className="rounded-3xl size-full bg-background text-muted-foreground hover:text-foreground hover:bg-muted border transition-colors">
                  <Ellipsis className="size-full" />
                </DockIcon>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>More</p>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
          <PopoverContent side="top" sideOffset={14} className="w-56 rounded-2xl p-2">
            <ul>
              {MORE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted",
                      isActive(item.href) && "bg-muted font-medium"
                    )}
                  >
                    <item.icon className="size-4 text-muted-foreground" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-2/3 m-auto" />

        {SOCIALS.map(([name, social]) => {
          const Icon = social.icon;
          return (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={name}>
                  <DockIcon className="rounded-3xl size-full bg-background text-muted-foreground hover:text-foreground hover:bg-muted border">
                    <Icon className="size-full" />
                  </DockIcon>
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        <Separator orientation="vertical" className="h-2/3 m-auto" />

        <DockIcon className="rounded-3xl size-full bg-background border">
          <ModeToggle className="size-full" />
        </DockIcon>
      </Dock>
    </div>
  );
}

/* ===================== MOBILE ===================== */

function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive();
  const path = usePathname();

  // close the menu after navigating
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-label="All pages"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-3 bottom-24 z-50 rounded-3xl border bg-card p-4 shadow-2xl"
            >
              <p className="mb-3 px-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Pages</p>
              <ul className="grid grid-cols-3 gap-2">
                {DATA.navbar.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs",
                        isActive(item.href) ? "bg-muted font-medium" : "bg-background"
                      )}
                    >
                      <item.icon className="size-5 text-muted-foreground" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex gap-2">
                  {SOCIALS.map(([name, social]) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}
                        className="flex size-10 items-center justify-center rounded-full border bg-background"
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  })}
                </div>
                <a href={`mailto:${DATA.contact.email}`} className="text-sm font-medium text-primary">
                  Email me
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-end gap-4 rounded-full border bg-card/90 px-4 py-3 shadow-lg backdrop-blur-xl">
          <MobileLink href="/" label="Home" active={isActive("/")} icon={<Home className="h-5 w-5" />} />
          <MobileLink href="/projects" label="Projects" active={isActive("/projects")} icon={<FolderGit2 className="h-5 w-5" />} />
          <MobileLink href="/tools" label="Tools" active={isActive("/tools")} icon={<LayoutGrid className="h-5 w-5" />} />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={cn("flex flex-col items-center gap-1 text-xs text-muted-foreground", open && "text-foreground")}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </span>
            <span>{open ? "Close" : "Menu"}</span>
          </button>
          {/* div wrapper, not a button: ModeToggle is already a <button> */}
          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <ModeToggle />
            </div>
            <span>Theme</span>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileLink({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn("flex flex-col items-center gap-1 text-xs text-muted-foreground", active && "text-foreground")}
    >
      <span className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-muted", active && "ring-1 ring-primary/40")}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
