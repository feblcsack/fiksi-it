// src/app/home/page.tsx
import { CoverCard } from "@/components/CoverCard";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Cover {
  id: string;
  coverArtist: string;
  originalTitle: string;
  originalArtist: string;
  coverAudioUrl: string;
  spotifyUrl?: string;
}

export default async function HomePage() {
  const q = query(collection(db, "covers"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const covers: Cover[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Cover, "id">),
  }));

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-balance font-serif text-5xl tracking-tight md:text-6xl">
            CoverSpace
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-neutral-400 md:text-lg">
            Platform untuk musisi menampilkan karya cover dari lagu-lagu hits lokal.
          </p>

          {/* Upload Button */}
          <Link
            href="/home/upload"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black transition-all hover:bg-neutral-100"
          >
            <Plus className="h-5 w-5" />
            Upload Cover
          </Link>
        </header>

        {/* Covers Grid */}
        {covers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {covers.map((cover) => (
              <CoverCard
                key={cover.id}
                coverArtist={cover.coverArtist}
                originalTitle={cover.originalTitle}
                originalArtist={cover.originalArtist}
                coverAudioUrl={cover.coverAudioUrl}
                spotifyUrl={cover.spotifyUrl}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-neutral-500">
              Belum ada cover yang diupload. Jadilah yang pertama!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
