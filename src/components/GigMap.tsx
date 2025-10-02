// components/GigMap.tsx
"use client";

import { useEffect, useState } from "react";
import { getGigsWithinRadius } from "@/services/gigService";
import { Gig } from "@/types";

export default function GigMap() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [radius, setRadius] = useState<1 | 5 | 10>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          setError("Tidak bisa mendapatkan lokasi. Pastikan GPS aktif.");
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
      setGigs(gigsData);
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

  return (
    <div className="w-full h-screen bg-gray-100">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-bold text-lg mb-3">Filter Radius</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleRadiusChange(1)}
            className={`px-4 py-2 rounded ${radius === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            1 km
          </button>
          <button
            onClick={() => handleRadiusChange(5)}
            className={`px-4 py-2 rounded ${radius === 5 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            5 km
          </button>
          <button
            onClick={() => handleRadiusChange(10)}
            className={`px-4 py-2 rounded ${radius === 10 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            10 km
          </button>
        </div>
        <button
          onClick={getUserLocation}
          className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🔄 Refresh Lokasi
        </button>
        <p className="mt-2 text-sm text-gray-600">
          Ditemukan: {gigs.length} gig
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 right-4 z-10 bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg max-w-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        </div>
      )}

      {/* Map Placeholder - Replace with actual Google Maps or Mapbox */}
      <div className="w-full h-full bg-gray-300 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
          <div className="text-center">
            <p className="text-xl font-bold mb-2">🗺️ Map Area</p>
            <p className="text-sm">Integrate Google Maps or Mapbox here</p>
            {userLocation && (
              <p className="text-xs mt-2">
                Your location: {userLocation.lat.toFixed(4)},{" "}
                {userLocation.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        {/* Gig Markers Simulation */}
        {gigs.map((gig, index) => (
          <div
            key={gig.id}
            onClick={() => setSelectedGig(gig)}
            className="absolute bg-red-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-red-600 shadow-lg"
            style={{
              left: `${20 + index * 10}%`,
              top: `${30 + index * 8}%`,
            }}
          >
            📍
          </div>
        ))}
      </div>

      {/* Gig Details Panel */}
      {selectedGig && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-6 rounded-lg shadow-lg z-10 max-w-md">
          <button
            onClick={() => setSelectedGig(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>

          {selectedGig.coverImage && (
            <img
              src={selectedGig.coverImage}
              alt={selectedGig.namaAcara}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          )}

          <h3 className="text-xl font-bold mb-2">{selectedGig.namaAcara}</h3>
          <p className="text-sm text-gray-600 mb-2">
            🎸 {selectedGig.musisiName}
          </p>
          <p className="text-sm text-gray-700 mb-2">{selectedGig.deskripsi}</p>
          <p className="text-sm text-gray-600 mb-2">
            📍 {selectedGig.lokasi.alamat}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            🕐 {new Date(selectedGig.jamMulai).toLocaleString("id-ID")}
          </p>

          <button
            onClick={() => (window.location.href = `/gig/${selectedGig.id}`)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Lihat Detail & Review
          </button>
        </div>
      )}

      {/* Gigs List Sidebar */}
      <div className="absolute top-4 right-4 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg p-4 z-10">
        <h3 className="font-bold text-lg mb-3">Gigs Terdekat</h3>
        {gigs.length === 0 ? (
          <p className="text-sm text-gray-600">Tidak ada gig di radius ini</p>
        ) : (
          <div className="space-y-2">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                onClick={() => setSelectedGig(gig)}
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
              >
                <p className="font-semibold text-sm">{gig.namaAcara}</p>
                <p className="text-xs text-gray-600">{gig.musisiName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(gig.jamMulai).toLocaleDateString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
