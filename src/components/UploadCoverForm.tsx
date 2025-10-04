// src/components/UploadCoverForm.tsx
"use client";

import { db, storage } from "@/lib/firebase/config";
// pastiin lo punya config firebase di path ini

import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import React, { useState } from "react";
import {
  Upload,
  Music,
  Loader2,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";

export default function CoverUploadPage() {
  const [coverArtist, setCoverArtist] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalArtist, setOriginalArtist] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Search Spotify tracks
  const searchSpotifyTrack = async () => {
    if (!searchQuery.trim()) {
      alert("Masukin judul lagu yang mau lo cari!");
      return;
    }

    setSearching(true);
    setShowResults(false);

    try {
      // Get Spotify token
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            btoa(
              process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID +
                ":" +
                process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
            ),
        },
        body: "grant_type=client_credentials",
      });

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // Search tracks
      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=5`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const searchData = await searchRes.json();
      setSearchResults(searchData.tracks.items || []);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      alert("Gagal search Spotify, cek console!");
    } finally {
      setSearching(false);
    }
  };

  const selectTrack = (track) => {
    setOriginalTitle(track.name);
    setOriginalArtist(track.artists.map((a) => a.name).join(", "));
    setSpotifyUrl(track.external_urls.spotify);
    setShowResults(false);
    setSearchQuery("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file audio dulu!");
      return;
    }
    if (!coverArtist || !originalTitle || !originalArtist) {
      alert("Isi semua field dulu!");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Upload ke Firebase Storage
      const storageRef = ref(storage, `covers/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Simpan ke Firestore
      await addDoc(collection(db, "covers"), {
        coverArtist,
        spotifyUrl,
        originalTitle,
        originalArtist,
        coverAudioUrl: url,
        createdAt: new Date(),
      });

      setSuccess(true);

      // Reset form
      setTimeout(() => {
        setCoverArtist("");
        setSearchQuery("");
        setOriginalTitle("");
        setOriginalArtist("");
        setSpotifyUrl("");
        setFile(null);
        setFileName("");
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Gagal upload, cek console!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-neutral-300">Share your musical talent</span>
          </div>
          <h1 className="text-balance font-serif text-4xl tracking-tight md:text-5xl">
            Upload Your Cover
          </h1>
          <p className="mt-4 text-pretty text-base text-neutral-400 md:text-lg">
            Bagikan interpretasi unik lo dari lagu-lagu favorit.
          </p>
        </header>

        {/* Form */}
        <div className="space-y-6">
          {/* Cover Artist Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Nama Musisi
            </label>
            <input
              type="text"
              placeholder="Siapa yang ngcover?"
              value={coverArtist}
              onChange={(e) => setCoverArtist(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 transition-colors focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>

          {/* Spotify Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Cari Lagu di Spotify
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cari judul lagu atau artis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchSpotifyTrack()}
                className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 transition-colors focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-700"
              />
              <button
                type="button"
                onClick={searchSpotifyTrack}
                disabled={searching || !searchQuery.trim()}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Cari
              </button>
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">
              Cari lagu original untuk auto-fill info
            </p>

            {/* Search Results */}
            {showResults && (
              <div className="mt-3 space-y-2 rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                {searchResults.length > 0 ? (
                  searchResults.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => selectTrack(track)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-850 p-3 text-left transition-all hover:border-neutral-700 hover:bg-neutral-800"
                    >
                      <div className="flex items-center gap-3">
                        {track.album.images[2] && (
                          <img
                            src={track.album.images[2].url}
                            alt={track.name}
                            className="h-12 w-12 rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-white">{track.name}</p>
                          <p className="text-sm text-neutral-400">
                            {track.artists.map((a) => a.name).join(", ")}
                          </p>
                        </div>
                        <Music className="h-4 w-4 text-green-500" />
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-sm text-neutral-500">
                    Lagu tidak ditemukan
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Original Song Info (Auto-filled) */}
          {(originalTitle || originalArtist) && (
            <div className="rounded-lg border border-green-900/30 bg-green-950/20 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium text-green-400">
                  Lagu dipilih
                </p>
              </div>
              <p className="text-base font-medium text-white">
                {originalTitle}
              </p>
              <p className="text-sm text-neutral-400">{originalArtist}</p>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              File Audio Cover
            </label>
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-neutral-800 bg-neutral-900 px-6 py-8 transition-colors hover:border-neutral-700"
              >
                <Upload className="h-6 w-6 text-neutral-400" />
                <div className="text-center">
                  <p className="text-sm font-medium text-white">
                    {fileName || "Pilih file audio"}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    MP3, WAV, OGG up to 50MB
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || !file || !originalTitle}
            className="group relative w-full overflow-hidden rounded-lg bg-white py-4 font-serif text-lg font-medium text-black transition-all hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Berhasil diupload!
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Upload Cover
                </>
              )}
            </span>
          </button>
        </div>

        <footer className="mt-12 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <h3 className="mb-3 font-serif text-lg font-medium">Guidelines</h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>• Pastikan lo punya hak untuk upload cover lagu</li>
            <li>• File audio maksimal 50MB dengan kualitas terbaik</li>
            <li>• Cantumkan kredit artis original dengan benar</li>
            <li>• Konten harus sesuai dengan community guidelines</li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
