"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/hero";
import { CoverCard } from "@/components/cover-card";
import { Navbar } from "@/components/organisms/Navbar";
import CoverPlayerModal from "@/components/cover-player-modal";
import { db } from "@/lib/firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { Footer } from "@/components/footer";
import PulsingCircle from "@/components/pulsing-circle";

interface Cover {
  id: string;
  title: string;
  originalArtist: string;
  coverArtist: string;
  imageSrc: string;
  description: string;
  audioSrc?: string;
  bandName?: string;
  bandLogo?: string;
}

interface Recommended {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
}

export default function Page() {
  const [featured, setFeatured] = useState<Cover[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCover, setSelectedCover] = useState<Cover | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"featured" | "recommended">(
    "featured"
  );

  const recommendedList: Recommended[] = [
    {
      id: 1,
      title: "Soft Breeze",
      artist: "Luna Aria",
      thumbnail: "/recommended/rec1.jpg",
      duration: "3:21",
    },
    {
      id: 2,
      title: "Sunset Drive",
      artist: "Noir City",
      thumbnail: "/recommended/rec2.jpg",
      duration: "4:02",
    },
    {
      id: 3,
      title: "Golden Hour",
      artist: "Echo Verde",
      thumbnail: "/recommended/rec3.jpg",
      duration: "2:57",
    },
  ];

  useEffect(() => {
    if (viewMode === "recommended") return;
    const coversCollection = collection(db, "covers");
    const q = query(coversCollection, orderBy("createdAt", "desc"), limit(6));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const coverList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Cover, "id">),
        }));
        setFeatured(coverList);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching covers:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [viewMode]);

  const handleCoverClick = (cover: Cover) => {
    setSelectedCover(cover);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCover(null), 300);
  };

  // 🧠 Fungsi baru untuk ubah mode dari Hero
  const handleSwitchView = (mode: "featured" | "recommended") => {
    setViewMode(mode);
  };

  return (
    <main>
      <Navbar />
      <div className="fixed bottom-6 right-6 z-50">
        <PulsingCircle />
      </div>
      <div className="pt-16 md:pt-16">
        <Hero onSwitchView={handleSwitchView} />
      </div>

      <section
        id="featured"
        aria-labelledby="featured-heading"
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <div className="mb-6 flex items-end justify-between md:mb-10">
          <div>
            <h2
              id="featured-heading"
              className="font-serif text-2xl font-semibold md:text-3xl"
            >
              {viewMode === "featured"
                ? "Featured Covers"
                : "Recommended For You"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {viewMode === "featured"
                ? "Curated selections with a warm, minimalist aesthetic."
                : "Handpicked tracks that match your vibe — chill, modern, and timeless."}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
          </div>
        ) : viewMode === "recommended" ? (
          <div className="space-y-4">
            {recommendedList.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between rounded-xl border p-4 shadow-sm hover:bg-muted/30 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={rec.thumbnail}
                    alt={rec.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {rec.artist}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {rec.duration}
                </span>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No covers uploaded yet.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Be the first to share your music!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <CoverCard
                key={item.id}
                {...item}
                onClick={() => handleCoverClick(item)}
              />
            ))}
          </div>
        )}
      </section>

      <CoverPlayerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cover={selectedCover}
      />

      <Footer />
    </main>
  );
}
