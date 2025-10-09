// src/app/musician/page.tsx
"use client";

import { useState, useEffect } from "react";
import { GigForm } from "@/components/features/GigForm";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";
import { Dialog } from "@headlessui/react";
import { Navbar } from "../../../../components/organisms/Navbar";

interface Gig {
  id: string;
  title: string;
  description: string;
  datetime: { toDate: () => Date };
  locationName: string;
}

export default function MusicianLandingPage() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>([]);

  // Ambil data gigs user dari Firestore
  useEffect(() => {
    if (!user) return;

    const gigsRef = collection(db, "gigs");
    const q = query(
      gigsRef,
      where("musisiId", "==", user.uid),
      orderBy("datetime", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Gig, "id">),
      }));
      setGigs(data);
    });

    return () => unsub();
  }, [user]);

  return (
    <>
      <div className="fixed top-0 w-full z-20">
        <Navbar />
      </div>

      <div className="min-h-screen bg-black text-white relative pt-16 md:pt-16">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="mb-20">
            <h2 className="text-5xl font-light tracking-tight mb-4">
              Hello, {user?.displayName?.split(" ")[0] || "Artist"}
            </h2>
            <p className="text-white/40 text-lg font-light mb-8 max-w-md">
              Manage your performances and connect with your audience
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white text-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-white/90 transition-all"
            >
              NEW GIG
            </button>
          </div>

          {/* Gigs Section */}
          <div>
            <div className="flex items-baseline justify-between mb-8">
              <h3 className="text-2xl font-light tracking-tight">Upcoming</h3>
              <span className="text-white/40 text-sm font-mono">
                {gigs.length}
              </span>
            </div>

            {gigs.length === 0 ? (
              <div className="border border-white/10 p-12 text-center">
                <p className="text-white/30 font-light">No gigs scheduled</p>
              </div>
            ) : (
              <div className="space-y-px">
                {gigs.map((gig) => (
                  <div
                    key={gig.id}
                    className="border border-white/10 p-6 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-light tracking-tight group-hover:text-white/80 transition-colors">
                        {gig.title}
                      </h4>
                      <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
                        {gig.locationName}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm font-light mb-4">
                      {gig.description || "—"}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-mono text-white/30">
                      <span>
                        {new Date(gig.datetime.toDate()).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(gig.datetime.toDate()).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal with Headless UI Dialog */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center p-6">
            <Dialog.Panel className="relative w-full max-w-2xl bg-black border border-white/20 p-8">
              <div className="flex justify-between items-center mb-8">
                <Dialog.Title className="text-2xl font-light tracking-tight">
                  Create Gig
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/40 hover:text-white transition-colors text-2xl font-light"
                >
                  ×
                </button>
              </div>
              <GigForm />
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </>
  );
}
