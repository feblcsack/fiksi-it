"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function UploadCoverPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [spotifyQuery, setSpotifyQuery] = useState("");
  const [spotifyResults, setSpotifyResults] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Spotify Search API
  const searchSpotify = async () => {
    if (!spotifyQuery) return;
    try {
      const tokenRes = await fetch("/api/spotify-token");
      const { access_token } = await tokenRes.json();

      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          spotifyQuery
        )}&type=track&limit=5`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const data = await res.json();
      setSpotifyResults(data.tracks?.items || []);
    } catch (err) {
      console.error("Spotify search error:", err);
      alert("Gagal mencari lagu di Spotify 😢");
    }
  };

  // ✅ Upload File + Simpan Metadata
  const handleUpload = async () => {
    if (!file || !title || !artist || !selectedTrack) {
      alert("Lengkapi semua data dulu bro!");
      return;
    }
  
    try {
      setUploading(true);
      setProgress(0);
  
      const formData = new FormData();
      formData.append("file", file);
  
      // Send to our Next.js API route
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
  
      const downloadURL = data.url;
  
      await addDoc(collection(db, "covers"), {
        title,
        artist,
        audioUrl: downloadURL,
        spotifyTrackId: selectedTrack.id,
        spotifyTitle: selectedTrack.name,
        spotifyArtist: selectedTrack.artists[0].name,
        createdAt: serverTimestamp(),
      });
  
      alert("Upload sukses bro! 🎉");
      setUploading(false);
      setTitle("");
      setArtist("");
      setFile(null);
      setSpotifyQuery("");
      setSpotifyResults([]);
      setSelectedTrack(null);
    } catch (err) {
      console.error("Error saat upload:", err);
      alert("Terjadi error saat upload. Coba lagi.");
      setUploading(false);
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Upload Cover Lagu 🎤</h1>

      <div className="space-y-4">
        <Input
          placeholder="Judul Cover"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Nama Musisi"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {file && <p className="text-sm text-gray-500">🎵 File: {file.name}</p>}

        {/* Spotify Search */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Cari Lagu Asli di Spotify 🎧
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="Cari lagu asli..."
              value={spotifyQuery}
              onChange={(e) => setSpotifyQuery(e.target.value)}
            />
            <Button onClick={searchSpotify}>Cari</Button>
          </div>

          {spotifyResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {spotifyResults.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-colors ${
                    selectedTrack?.id === track.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTrack(track)}
                >
                  <img
                    src={track.album.images[2]?.url}
                    alt={track.name}
                    className="w-10 h-10 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{track.name}</p>
                    <p className="text-xs text-gray-500">
                      {track.artists.map((a: any) => a.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTrack && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Lagu Asli:</h3>
            <iframe
              src={`https://open.spotify.com/embed/track/${selectedTrack.id}`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        )}

        <Button
          className="w-full mt-6"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Mengunggah...
            </>
          ) : (
            "Upload Cover"
          )}
        </Button>

        {uploading && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Progress: {progress.toFixed(0)}%
          </p>
        )}
      </div>
    </div>
  );
}
