"use client";

import { useState } from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  Folder,
  Sparkles,
  Share2,
  SunMoon,
  X,
} from "lucide-react";
import { DATA } from "@/data/resume";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block">
        <DesktopNavbar />
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <MobileNavbar />
      </div>
    </>
  );
}

/* ===================== DESKTOP ===================== */

function DesktopNavbar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
      <Dock className="z-50 pointer-events-auto relative h-14 p-2 w-fit mx-auto flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
        {DATA.navbar.map((item) => {
          const isExternal = item.href.startsWith("http");
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <DockIcon className="rounded-3xl size-full bg-background text-muted-foreground hover:text-foreground hover:bg-muted border transition-colors">
                    <item.icon className="size-full" />
                  </DockIcon>
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{item.label}</p>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          );
        })}

        <Separator orientation="vertical" className="h-2/3 m-auto" />

        {Object.entries(DATA.contact.social)
          .filter(([_, s]) => s.navbar)
          .map(([name, social]) => {
            const Icon = social.icon;
            return (
              <Tooltip key={name}>
                <TooltipTrigger asChild>
                  <a href={social.url} target="_blank">
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
  const [open, setOpen] = useState<
    null | "content" | "creative" | "social"
  >(null);

  const contentLinks = DATA.navbar.filter((i) =>
    ["Blogs", "Articles"].includes(i.label)
  );

  const creativeLinks = DATA.navbar.filter((i) =>
    ["Music", "Photography", "Resipy"].includes(i.label)
  );

  const socials = Object.entries(DATA.contact.social).filter(
    ([_, s]) => s.navbar
  );

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      {/* Popup ABOVE bar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2"
          >
            <div className="flex items-end gap-4 rounded-full border bg-card/90 backdrop-blur-xl px-4 py-3 shadow-lg">
              {open === "content" &&
                contentLinks.map((item) => (
                  <MobileItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                  </MobileItem>
                ))}

              {open === "creative" &&
                creativeLinks.map((item) => (
                  <MobileItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                  </MobileItem>
                ))}

              {open === "social" &&
                socials.map(([name, social]) => {
                  const Icon = social.icon;
                  return (
                    <MobileItem
                      key={name}
                      href={social.url}
                      label={name}
                      external
                    >
                      <Icon className="h-5 w-5" />
                    </MobileItem>
                  );
                })}

              {/* Close button – uniform item */}
              <button
                onClick={() => setOpen(null)}
                className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <X className="h-5 w-5" />
                </div>
                <span>Close</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Base bar */}
      <div className="flex items-end gap-4 rounded-full border bg-card/90 backdrop-blur-xl px-4 py-3 shadow-lg">
        <MobileButton
          icon={<Home className="h-5 w-5" />}
          label="Home"
          onClick={() => (window.location.href = "/")}
        />

        <MobileButton
          icon={<Folder className="h-5 w-5" />}
          label="Content"
          active={open === "content"}
          onClick={() => setOpen(open === "content" ? null : "content")}
        />

        <MobileButton
          icon={<Sparkles className="h-5 w-5" />}
          label="Creative"
          active={open === "creative"}
          onClick={() => setOpen(open === "creative" ? null : "creative")}
        />

        <MobileButton
          icon={<Share2 className="h-5 w-5" />}
          label="Social"
          active={open === "social"}
          onClick={() => setOpen(open === "social" ? null : "social")}
        />

        <MobileButton icon={<SunMoon className="h-5 w-5" />} label="Theme">
          <ModeToggle />
        </MobileButton>
      </div>
    </div>
  );
}

/* ===================== HELPERS ===================== */

function MobileButton({
  icon,
  label,
  onClick,
  active,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 text-xs text-muted-foreground",
        active && "text-foreground"
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        {children ?? icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

function MobileItem({
  href,
  label,
  children,
  external,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        {children}
      </div>
      <span>{label}</span>
    </a>
  );
}
