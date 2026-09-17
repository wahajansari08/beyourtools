import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' blob: https:; media-src 'self' blob: data: https:; frame-src 'self' https:; worker-src 'self' blob:;",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  outputFileTracingRoot: process.cwd(),
  htmlLimitedBots: /.*/,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://beyourtools.com/:path*",
        permanent: true,
      },
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
