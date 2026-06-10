import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    resolveAlias: {
      framer: "./lib/framer-shim.ts",
    },
  },
};

export default nextConfig;
