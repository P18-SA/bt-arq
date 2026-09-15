import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Permite abrir el dev server a traves del tunnel de Cloudflare
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
