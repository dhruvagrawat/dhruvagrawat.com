import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Script from "next/script";
import { Instrument_Sans, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: `${DATA.name} — Full-Stack Engineer & Freelancer`,
    template: `%s | ${DATA.name}`,
  },
  description:
    "Dhruv Agrawat is a full-stack software engineer and freelancer in New Delhi building fast, scalable web products with React, Next.js and Node.js — plus 25 free online tools.",
  keywords: [
    "Dhruv Agrawat", "Full-Stack Engineer", "Freelancer", "Next.js", "React",
    "TypeScript", "Node.js", "Web Development", "India", "Portfolio",
  ],
  authors: [{ name: DATA.name, url: DATA.url }],
  creator: DATA.name,
  openGraph: {
    title: `${DATA.name} — Full-Stack Engineer & Freelancer`,
    description:
      "Full-stack software engineer and freelancer in New Delhi. Work, projects, trek photography and free web tools.",
    url: DATA.url,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${DATA.name} — Full-Stack Engineer`,
    description: DATA.description,
    creator: "@DhruvAgrawat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    types: { "text/markdown": "/llms.txt" },
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          sans.variable,
          serif.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <TooltipProvider delayDuration={0}>
            <div className="relative z-10  mx-auto py-12 pb-24 sm:py-24 px-6">
              {children}
            </div>
            <Navbar />
          </TooltipProvider>
        </ThemeProvider>

        {/* Google Analytics 4 — loaded after the page is interactive so it never slows the first paint */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-JTKTMXGE6X" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-JTKTMXGE6X');`}
        </Script>
      </body>
    </html>
  );
}
