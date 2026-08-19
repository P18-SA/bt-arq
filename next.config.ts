import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite abrir el dev server a traves del tunnel de Cloudflare
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
