// components/NearbyGigsList.tsx
"use client";

import { useEffect, useState } from "react";
import { getGigsWithinRadius, calculateDistance } from "@/services/gigService";
import { Gig } from "@/types";

export default function NearbyGigsList() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [radius, setRadius] = useState<1 | 5 | 10>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "date">("distance");

  const getUserLocation = () => {
    setLoading(true);
    setError("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          loadGigs(location.lat, location.lng, radius);
        },
        (error) => {
          setError(
            "Tidak bisa mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses lokasi.",
          );
          setLoading(false);
        },
      );
    } else {
      setError("Browser tidak mendukung geolocation");
      setLoading(false);
    }
  };

  const loadGigs = async (lat: number, lng: number, radiusKm: number) => {
    try {
      setLoading(true);
      const gigsData = await getGigsWithinRadius(lat, lng, radiusKm);

      // Tambahkan jarak ke setiap gig
      const gigsWithDistance = gigsData.map((gig) => ({
        ...gig,
        distance: calculateDistance(
          lat,
          lng,
          gig.lokasi.latitude,
          gig.lokasi.longitude,
        ),
      }));

      setGigs(gigsWithDistance);
    } catch (err: any) {
      setError(err.message || "Gagal memuat gigs");
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius: 1 | 5 | 10) => {
    setRadius(newRadius);
    if (userLocation) {
      loadGigs(userLocation.lat, userLocation.lng, newRadius);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const sortedGigs = [...gigs].sort((a, b) => {
    if (sortBy === "distance") {
      return (a as any).distance - (b as any).distance;
    } else {
      return new Date(a.jamMulai).getTime() - new Date(b.jamMulai).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header & Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🎸 Live Gigs Terdekat
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Filter Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Filter Radius
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRadiusChange(1)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    radius === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  1 km
                </button>
                <button
                  onClick={() => handleRadiusChange(5)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    radius === 5
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  5 km
                </button>
                <button
                  onClick={() => handleRadiusChange(10)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    radius === 10
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  10 km
                </button>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔄 Urutkan
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "distance" | "date")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="distance">Jarak Terdekat</option>
                <option value="date">Tanggal Event</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔄 Update Lokasi
              </label>
              <button
                onClick={getUserLocation}
                disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Loading..." : "Refresh Lokasi"}
              </button>
            </div>
          </div>

          {/* Info Bar */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-sm text-gray-600">
                Ditemukan:{" "}
                <span className="font-bold text-gray-800">
                  {gigs.length} gig
                </span>
              </p>
              {userLocation && (
                <p className="text-xs text-gray-500 mt-1">
                  Lokasi Anda: {userLocation.lat.toFixed(4)},{" "}
                  {userLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
            {gigs.length > 0 && (
              <div className="text-sm text-gray-600">
                Radius:{" "}
                <span className="font-bold text-blue-600">{radius} km</span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-pulse">
              <div className="text-4xl mb-4">🔄</div>
              <p className="text-lg font-semibold text-gray-700">
                Mencari gigs terdekat...
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && gigs.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎸</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Belum ada gig di radius ini
            </h3>
            <p className="text-gray-600 mb-6">
              Coba perluas radius pencarian atau cek lagi nanti
            </p>
            <button
              onClick={() => handleRadiusChange(10)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Cari dalam radius 10 km
            </button>
          </div>
        )}

        {/* Gigs List */}
        {!loading && gigs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGigs.map((gig: any) => (
              <div
                key={gig.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Cover Image */}
                {gig.coverImage ? (
                  <img
                    src={gig.coverImage}
                    alt={gig.namaAcara}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                    <span className="text-6xl">🎤</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Distance Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      📍 {gig.distance.toFixed(1)} km
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(gig.jamMulai) > new Date()
                        ? "🔴 Upcoming"
                        : "⚪ Past"}
                    </span>
                  </div>

                  {/* Event Name */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {gig.namaAcara}
                  </h3>

                  {/* Musisi Name */}
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    🎸{" "}
                    <span className="ml-1 font-semibold">{gig.musisiName}</span>
                  </p>

                  {/* Date & Time */}
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    📅{" "}
                    <span className="ml-1">
                      {new Date(gig.jamMulai).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    🕐{" "}
                    <span className="ml-1">
                      {new Date(gig.jamMulai).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>

                  {/* Location */}
                  <p className="text-sm text-gray-600 mb-4 flex items-start">
                    📍{" "}
                    <span className="ml-1 line-clamp-2">
                      {gig.lokasi.alamat}
                    </span>
                  </p>

                  {/* Description Preview */}
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {gig.deskripsi}
                  </p>

                  {/* Action Button */}
                  <a
                    href={`/gig/${gig.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold transition"
                  >
                    Lihat Detail →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
