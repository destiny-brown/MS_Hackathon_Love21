/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/learn-play/daily-myth-buster",
        destination: "/learn-play/21-moves",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
