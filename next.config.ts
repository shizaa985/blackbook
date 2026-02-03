import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"], // allow pdf-parse in server routes
};

export default nextConfig;


