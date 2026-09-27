import Link from "next/link";
import { History } from "lucide-react";

// Top-right entry point to the /1999 retro version of the site.
export default function TimeTravelButton() {
  return (
    <Link
      href="/1999"
      className="group absolute -top-10 right-0 sm:-top-16 z-20 inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur px-3.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground shadow-sm transition-all hover:text-foreground hover:border-foreground/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <History
        className="size-4 transition-transform duration-500 group-hover:-rotate-[360deg]"
        aria-hidden
      />
      <span>Go back in time</span>
      <span className="font-mono text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        1999
      </span>
    </Link>
  );
}
