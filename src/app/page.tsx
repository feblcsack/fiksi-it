// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            🎸 LiveGig Lokal
          </h1>
          <p className="text-xl md:text-2xl mb-12">
            Temukan event musik lokal terdekat & dukung musisi favoritmu
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-8">
              <div className="text-6xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold mb-4">Untuk Musisi</h2>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ Buat & promosikan event gig</li>
                <li>✓ Upload cover lagu/video</li>
                <li>✓ Dapatkan review dari penonton</li>
                <li>✓ Bangun base follower</li>
              </ul>
              <a
                href="/register"
                className="inline-block bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
              >
                Daftar sebagai Musisi
              </a>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-8">
              <div className="text-6xl mb-4">🎧</div>
              <h2 className="text-2xl font-bold mb-4">Untuk Penonton</h2>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ Temukan gig terdekat di map</li>
                <li>✓ Filter berdasarkan radius</li>
                <li>✓ Lihat detail event & lokasi</li>
                <li>✓ Kasih review & follow musisi</li>
              </ul>
              <a
                href="/register"
                className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-400 transition"
              >
                Daftar sebagai Penonton
              </a>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
            <p className="text-lg mb-4">Sudah punya akun?</p>
            <a
              href="/login"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Login Sekarang
            </a>
          </div>

          <div className="mt-16 text-sm opacity-80">
            <p>© 2025 LiveGig Lokal. Platform musik lokal Indonesia.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
