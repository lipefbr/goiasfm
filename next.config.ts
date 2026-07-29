import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mantém standalone para builds otimizados, mas a Vercel ignora isso
  // e usa o build padrão dela
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
  // Define explicitamente o root do Turbopack para evitar warning
  // de "workspace root inferred" em ambientes de deploy
  turbopack: {
    root: __dirname,
  },
  // Permite que o proxy HLS funcione bem
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
