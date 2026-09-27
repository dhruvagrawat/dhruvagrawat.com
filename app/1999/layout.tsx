import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome 2 My Homepage (1999)",
  description:
    "Dhruv Agrawat's portfolio, the way it would have looked on the web in 1999.",
};

export default function RetroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
