import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  turbopack: { root: process.cwd() },
  images: { formats: ["image/webp"], qualities: [75, 90], imageSizes: [64, 128, 256, 512] },
};

export default config;
