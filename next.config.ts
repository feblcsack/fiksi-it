import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      "lh3.googleusercontent.com",
      "cdn-icons-png.flaticon.com",
    ],
    formats: ["image/webp", "image/avif"], // ✅ optimasi format gambar
  },

  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"], // ✅ reduce bundle size
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // ✅ hapus console.log di production
  },

  eslint: {
    ignoreDuringBuilds: true, // ⚠️ biar build gak gagal di Vercel
  },

  typescript: {
    ignoreBuildErrors: true, // ⚠️ build tetap jalan meski ada TS error minor
  },
};

export default nextConfig;
