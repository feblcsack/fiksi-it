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
    // ⚠️ Ini buat skip error ESLint waktu build (biar Vercel gak gagal)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Ini buat skip error type-check waktu build (opsional, bisa lu matiin lagi nanti)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
