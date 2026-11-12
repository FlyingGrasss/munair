import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ypiavkaiyeweqjycmwfx.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },
  outputFileTracingIncludes: {
    "/api/design/instagram/*": ["./public/fonts/**/*", "./design/instagram/assets/**/*"],
  },
};

export default nextConfig;
