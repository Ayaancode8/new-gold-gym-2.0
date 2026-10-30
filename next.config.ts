import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  experimental: { useTypeScriptCli: false },
  trailingSlash: true,
  poweredByHeader: false,
  devIndicators: false,
  turbopack: { root: process.cwd() },
  images: { unoptimized: true, formats: ["image/webp"], qualities: [75, 90], imageSizes: [64, 128, 256, 512] },
};

export default config;
