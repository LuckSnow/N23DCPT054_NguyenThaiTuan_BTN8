import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["bcryptjs", "pg"],
};

export default nextConfig;
