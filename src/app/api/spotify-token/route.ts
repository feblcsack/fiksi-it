import { NextResponse } from "next/server";

// Opsi 1 (Cara yang lebih modern): Tambahkan ini untuk memaksa route ini menjadi dinamis
// dan tidak di-cache di level route.
export const dynamic = 'force-dynamic';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  // 1. Validasi: Pastikan environment variables ada.
  // Ini penting untuk debugging.
  if (!clientId || !clientSecret) {
    console.error("Kesalahan: SPOTIFY_CLIENT_ID atau SPOTIFY_CLIENT_SECRET tidak diatur di file .env.local");
    return NextResponse.json(
      { error: "Kredensial Spotify tidak diatur di server." },
      { status: 500 }
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      // Opsi 2 (Cara paling eksplisit): Nonaktifkan cache khusus untuk fetch ini.
      // Ini adalah cara yang paling direkomendasikan dan jelas.
      cache: 'no-store',
    });

    // 2. Error Handling: Cek jika respons dari Spotify tidak sukses (bukan 2xx).
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Gagal mendapatkan token dari Spotify:", errorData);
      return NextResponse.json(
        { error: `Gagal mendapatkan token dari Spotify: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Terjadi kesalahan internal saat menghubungi Spotify:", error);
    return NextResponse.json(
        { error: "Terjadi kesalahan internal server." },
        { status: 500 }
    );
  }
}

