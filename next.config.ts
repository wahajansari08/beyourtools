import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.beyourtools.com" }],
        destination: "https://beyourtools.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
