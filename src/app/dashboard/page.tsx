// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/services/authService";
import { getGigsByMusisi } from "@/services/gigService";
import { getReviewsByMusisi } from "@/services/reviewService";
import { Gig, Review } from "@/types";
import GigMap from "@/components/GigMap";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [myGigs, setMyGigs] = useState<Gig[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadMusisiData = async () => {
      if (user && user.role === "musisi") {
        try {
          const [gigs, reviews] = await Promise.all([
            getGigsByMusisi(user.uid),
            getReviewsByMusisi(user.uid),
          ]);
          setMyGigs(gigs);
          setMyReviews(reviews);
        } catch (error) {
          console.error("Error loading musisi data:", error);
        } finally {
          setLoadingData(false);
        }
      } else {
        setLoadingData(false);
      }
    };

    if (user) {
      loadMusisiData();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // Dashboard untuk User Biasa (Penonton)
  if (user.role === "user") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-md mb-6">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                LiveGig Lokal
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {user.displayName || user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Gigs List - No Map Needed */}
        <NearbyGigsList />
      </div>
    );
  }

  // Dashboard untuk Musisi
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              LiveGig Lokal - Musisi
            </h1>
            <p className="text-sm text-gray-600">
              Welcome, {user.displayName || user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Action Buttons */}
        <div className="mb-6 flex gap-4">
          <a
            href="/create-gig"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold"
          >
            + Buat Event Gig Baru
          </a>
          <a
            href="/map"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-semibold"
          >
            🗺️ Lihat Map
          </a>
        </div>

        {loadingData ? (
          <div className="text-center py-12">
            <p className="text-xl">Loading data...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* My Gigs */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Event Gig Saya</h2>
              {myGigs.length === 0 ? (
                <p className="text-gray-600">Belum ada event yang dibuat</p>
              ) : (
                <div className="space-y-4">
                  {myGigs.map((gig) => (
                    <div
                      key={gig.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <h3 className="font-bold text-lg mb-1">
                        {gig.namaAcara}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {gig.lokasi.alamat}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        {new Date(gig.jamMulai).toLocaleString("id-ID")}
                      </p>
                      <a
                        href={`/gig/${gig.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Lihat Detail →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Reviews */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Review dari Penonton</h2>
              {myReviews.length === 0 ? (
                <p className="text-gray-600">Belum ada review</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {myReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
