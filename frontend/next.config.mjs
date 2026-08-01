/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
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
