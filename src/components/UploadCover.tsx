"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UploadCoverForm() {
  const [artist, setArtist] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    const res = await fetch(`/api/spotify/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  }

  async function handleUpload() {
    if (!artist || !selectedTrack || !file) return alert("Isi semua data!");
    setLoading(true);

    const fileRef = ref(storage, `covers/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on("state_changed", null, console.error, async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);

      await addDoc(collection(db, "covers"), {
        artist,
        track: selectedTrack,
        coverUrl: url,
        createdAt: serverTimestamp(),
      });

      alert("Cover uploaded!");
      setLoading(false);
      setFile(null);
      setSelectedTrack(null);
      setQuery("");
      setArtist("");
    });
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 border rounded-lg space-y-4 bg-white/10 backdrop-blur">
      <h2 className="text-xl font-bold text-center">Upload Cover Lagu 🎵</h2>

      <Input
        placeholder="Nama Musisi"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />

      <div className="flex gap-2">
        <Input
          placeholder="Cari Lagu di Spotify..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Cari</Button>
      </div>

      {results.length > 0 && (
        <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
          {results.map((r) => (
            <div
              key={r.id}
              className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${
                selectedTrack?.id === r.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedTrack(r)}
            >
              {r.name} — {r.artists[0].name}
            </div>
          ))}
        </div>
      )}

      {selectedTrack && (
        <iframe
          src={`https://open.spotify.com/embed/track/${selectedTrack.id}`}
          width="100%"
          height="80"
          allow="encrypted-media"
        ></iframe>
      )}

      <Input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <Button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Cover"}
      </Button>
    </div>
  );
}
