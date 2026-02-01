import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf2json'],  // ← ADD THIS LINE
  },
};

export default nextConfig;

