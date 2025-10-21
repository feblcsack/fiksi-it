"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";

const recommendedData = [
  {
    id: 1,
    title: "Your Mix 1",
    artist: "maggy, theboyQ",
    image: "/recommended/rec1.jpg",
  },
  {
    id: 2,
    title: "Your Mix 2",
    artist: "vik, JACKBOYS, jcr",
    image: "/recommended/rec2.jpg",
  },
  {
    id: 3,
    title: "Your Mix 3",
    artist: "sincerely Lue, repro",
    image: "/recommended/rec3.jpg",
  },
  {
    id: 4,
    title: "Late Night Lofi",
    artist: "Discovery Playlists",
    image: "/recommended/rec4.jpg",
  },
  {
    id: 5,
    title: "Soul Waves",
    artist: "Noir City",
    image: "/recommended/rec5.jpg",
  },
];

export default function RecommendedPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />

      <div className="pt-24 pb-16 container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold font-serif">Recommended For You</h1>
          <button
            onClick={() => router.push("/dashboard/homeMuc")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to Home
          </button>
        </div>

        <p className="text-gray-400 mb-8">
          Handpicked tracks and playlists inspired by your recent favorites.
        </p>

        {/* Horizontal scroll section */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="flex gap-6 snap-x snap-mandatory pb-4">
            {recommendedData.map((item) => (
              <div
                key={item.id}
                className="snap-center flex-shrink-0 w-56 bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-medium truncate">{item.title}</h2>
                  <p className="text-sm text-gray-400 truncate">{item.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section bawah: Recently Played style */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Recently Played</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {recommendedData.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow hover:scale-[1.02] transition-transform"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{item.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
