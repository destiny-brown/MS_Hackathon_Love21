/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "love21foundation.com",
        pathname: "/wp-content/uploads/**",
      },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "autisticandunapologetic.com" },
      { protocol: "https", hostname: "media.abilitymagazine.com" },
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "cdn2.psychologytoday.com" },
      { protocol: "https", hostname: "hbr.org" },
      { protocol: "https", hostname: "static01.nyt.com" },
      { protocol: "https", hostname: "imageio.forbes.com" },
      { protocol: "https", hostname: "assets2.cbsnewsstatic.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/learn-play/daily-myth-buster",
        destination: "/learn-play/21-moves",
        permanent: true,
      },
      {
        source: "/impact",
        destination: "/impact-dashboard",
        permanent: true,
      },
      {
        source: "/donor/portal",
        destination: "/supporter/dashboard",
        permanent: true,
      },
      {
        source: "/volunteer/portal",
        destination: "/supporter/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/login?next=/supporter/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
