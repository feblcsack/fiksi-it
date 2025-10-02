import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', // domain avatar Google
      // tambahin domain lain kalau perlu
    ],
  },
}

export default nextConfig;
