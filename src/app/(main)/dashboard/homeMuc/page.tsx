"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/hero";
import { CoverCard } from "@/components/cover-card";
import { Navbar } from "@/components/organisms/Navbar";
import CoverPlayerModal from "@/components/cover-player-modal";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { Footer } from "@/components/footer";

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

export default function Page() {
  const [featured, setFeatured] = useState<Cover[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCover, setSelectedCover] = useState<Cover | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const coversCollection = collection(db, "covers");
    const q = query(coversCollection, orderBy("createdAt", "desc"), limit(6));

    // 🔹 Realtime listener
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

    return () => unsubscribe(); // Cleanup listener saat unmount
  }, []);

  const handleCoverClick = (cover: Cover) => {
    setSelectedCover(cover);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCover(null), 300);
  };

  return (
    <main>
      <Navbar />
      <div className="pt-16 md:pt-16">
        <Hero />
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
              Featured Covers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Curated selections with a warm, minimalist aesthetic.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No covers uploaded yet.</p>
            <p className="text-sm text-gray-500 mt-2">Be the first to share your music!</p>
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
