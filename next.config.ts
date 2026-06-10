import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      framer: "./lib/framer-shim.ts",
    },
  },
};

export default nextConfig;
