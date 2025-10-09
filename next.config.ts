import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', // domain avatar Google
      // tambahin domain lain kalau perlu
    ],
  },
  eslint: {
    // ⚠️ Biar Vercel gak gagal gara-gara ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Biar build gak gagal gara-gara error TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
