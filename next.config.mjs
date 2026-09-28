/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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