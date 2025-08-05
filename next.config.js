/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "143.244.140.123",
        port: "3001", // optional, only needed if non-default
        pathname: "/**",
      },
    ],
  },
};
module.exports = nextConfig;
