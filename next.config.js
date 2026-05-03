/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
  async headers() {
    return [
      // 24h browser cache for public static media assets.
      // Scoped explicitly to specific folders to prevent downgrading Next.js's 1-year immutable cache on /_next/static/ built assets.
      {
        source: "/(projects|experience|writing|music|blog)/:path*\\.(jpg|jpeg|png|webp|avif|gif|svg|ico|mp4|mp3|woff2|woff)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=3600" },
        ],
      },
      {
        source: "/api/sb-contact",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  // Preserve old Wix page and blog URLs — redirect to new counterparts (permanent 301)
  async redirects() {
    return [
      {
        source: "/work",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/experience",
        permanent: true,
      },
      {
        source: "/social",
        destination: "/music",
        permanent: true,
      },
      {
        source: "/post/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      // Old Wix blog category pages
      {
        source: "/blog/categories/:path*",
        destination: "/blog",
        permanent: true,
      },
      // Old Wix sitemap sub-files — redirect to unified sitemap
      {
        source: "/pages-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/blog-posts-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/blog-categories-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      // Redirect all auto-generated *.vercel.app domains to canonical domain.
      // Vercel creates multiple .vercel.app aliases per deployment that cannot
      // be disabled. This runs at the CDN/edge level before middleware.
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        destination: "https://www.anshuljain.net/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
