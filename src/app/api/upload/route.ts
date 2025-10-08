import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const originalArtist = formData.get("originalArtist") as string;
    const coverArtist = formData.get("coverArtist") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Convert File ke Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `covers/${Date.now()}-${file.name}`;
    const bucket = adminStorage.bucket();

    // Upload file ke Firebase Storage
    const upload = bucket.file(fileName);
    await upload.save(buffer, {
      metadata: { contentType: file.type },
      resumable: false,
    });

    // Ambil signed URL
    const [audioUrl] = await upload.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });

    // Simpan metadata ke Firestore
    await adminDb.collection("covers").add({
      title,
      originalArtist,
      coverArtist,
      description,
      audioSrc: audioUrl,
      imageSrc: "/default-cover.jpg", // fallback
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Upload berhasil!", url: audioUrl });
  } catch (err: any) {
    console.error("🔥 Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
