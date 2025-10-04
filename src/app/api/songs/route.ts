// src/app/api/songs/route.ts
import { getSpotifyTrackId } from "@/lib/spotify";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, artist } = await request.json();

    if (!title || !artist) {
      return NextResponse.json(
        { error: "Title and artist are required" },
        { status: 400 },
      );
    }

    // Panggil fungsi server-side untuk mendapatkan Spotify Track ID
    const spotifyTrackId = await getSpotifyTrackId(title, artist);

    // Simpan ke Firestore
    const songsCollection = collection(db, "songs");
    const newSongDoc = await addDoc(songsCollection, {
      title,
      artist,
      spotifyTrackId: spotifyTrackId || null, // Simpan null jika tidak ditemukan
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      message: "Song added successfully",
      id: newSongDoc.id,
      spotifyTrackId,
    });
  } catch (error) {
    console.error("Error adding song:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
