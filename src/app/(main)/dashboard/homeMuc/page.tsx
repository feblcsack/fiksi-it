"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/hero";
import { CoverCard } from "@/components/cover-card";
import { Navbar } from "@/components/organisms/Navbar";
import { db } from "@/lib/firebase/config"; // path yang sama kayak di upload
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { Footer } from "../../../../components/footer";

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

  useEffect(() => {
    const fetchCovers = async () => {
      try {
        const coversCollection = collection(db, "covers");
        const q = query(coversCollection, orderBy("createdAt", "desc"), limit(6));
        const snapshot = await getDocs(q);
        const coverList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Cover),
        }));
        setFeatured(coverList);
      } catch (err) {
        console.error("Error fetching covers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCovers();
  }, []);

  return (
    <main>
      <Navbar />
      <Hero />
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
          <Footer/>
        </div>

        {isLoading ? (
          <p>Loading covers...</p>
        ) : featured.length === 0 ? (
          <p className="text-muted-foreground">No covers uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <CoverCard key={item.id} {...item} />
            ))}
          </div>
        )}


      </section>
    </main>
  );
}
