/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep this ON. Vercel's Image Optimization is billed per source image, and this site
  // already ships pre-sized WebP files (scripts/optimize-photos.py), so it would only cost
  // money. Use plain <img> or next/image — both serve the files as-is.
  images: {
    unoptimized: true,
  },

  // Let browsers and Vercel's CDN keep images for 30 days instead of re-checking on every
  // visit, so returning visitors cost (almost) no bandwidth.
  async headers() {
    const longCache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }]
    return ["/photography/:path*", "/summit/:path*", "/travel/countries-110m.json", "/images/:path*", "/payments/:path*", "/recipe-photos/:path*"].map(
      (source) => ({ source, headers: longCache })
    )
  },
 
  // Friendly aliases → the real URLs (permanent, so search engines consolidate them)
  async redirects() {
    return [
      { source: "/recipes", destination: "/resipy", permanent: true },
      { source: "/recipes/:slug", destination: "/resipy/:slug", permanent: true },
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:slug", destination: "/blogs/:slug", permanent: true },
      { source: "/more", destination: "/tools", permanent: true },
    ]
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig