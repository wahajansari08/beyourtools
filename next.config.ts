import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
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
      {
        source: "/image-converter/pdf-to-jpg",
        destination: "/pdf-tools/pdf-to-jpg",
        permanent: true,
      },
      {
        source: "/&",
        destination: "/",
        permanent: true,
      },
      {
        source: "/%26",
        destination: "/",
        permanent: true,
      },
      {
        source: "/$",
        destination: "/",
        permanent: true,
      },
      {
        source: "/%24",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
