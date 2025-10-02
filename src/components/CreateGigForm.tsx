// components/CreateGigForm.tsx
"use client";

import { useState } from "react";
import { createGig } from "@/services/gigService";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function CreateGigForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [namaAcara, setNamaAcara] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [alamat, setAlamat] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        () => {
          setError("Tidak bisa mendapatkan lokasi. Pastikan GPS aktif.");
        },
      );
    } else {
      setError("Browser tidak mendukung geolocation");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!user || user.role !== "musisi") {
      setError("Hanya musisi yang bisa membuat event");
      setLoading(false);
      return;
    }

    try {
      const gigData = {
        musisiId: user.uid,
        musisiName: user.displayName || user.email,
        namaAcara,
        deskripsi,
        lokasi: {
          alamat,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        jamMulai: new Date(jamMulai),
      };

      await createGig(gigData, coverFile || undefined);
      setSuccess(true);

      // Reset form
      setNamaAcara("");
      setDeskripsi("");
      setAlamat("");
      setLatitude("");
      setLongitude("");
      setJamMulai("");
      setCoverFile(null);

      // Redirect setelah 2 detik
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal membuat event");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "musisi") {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-100 border border-red-400 text-red-700 rounded">
        Hanya musisi yang bisa membuat event gig.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Buat Event Gig Baru
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Event berhasil dibuat! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="namaAcara"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Acara
          </label>
          <input
            id="namaAcara"
            type="text"
            value={namaAcara}
            onChange={(e) => setNamaAcara(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Konser Akustik di Taman"
          />
        </div>

        <div>
          <label
            htmlFor="deskripsi"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Deskripsi event, genre musik, dll..."
          />
        </div>

        <div>
          <label
            htmlFor="alamat"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Alamat Lengkap
          </label>
          <input
            id="alamat"
            type="text"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jl. Sudirman No. 123, Jakarta"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="-6.200000"
            />
          </div>
          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="106.816666"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          📍 Gunakan Lokasi Saat Ini
        </button>

        <div>
          <label
            htmlFor="jamMulai"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Waktu Mulai
          </label>
          <input
            id="jamMulai"
            type="datetime-local"
            value={jamMulai}
            onChange={(e) => setJamMulai(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="coverFile"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cover Image (Opsional)
          </label>
          <input
            id="coverFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {coverFile && (
            <p className="mt-2 text-sm text-gray-600">File: {coverFile.name}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Membuat Event..." : "Buat Event"}
        </button>
      </form>
    </div>
  );
}
