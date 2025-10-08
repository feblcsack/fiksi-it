"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";

interface FormData {
  title: string;
  originalArtist: string;
  coverArtist: string;
  description: string;
  bandName: string;
  bandLogo: string;
  imageSrc: string;
  audioSrc: string;
}

export default function UploadCover() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    originalArtist: "",
    coverArtist: "",
    description: "",
    bandName: "",
    bandLogo: "",
    imageSrc: "",
    audioSrc: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewLogo, setPreviewLogo] = useState<string>("");

  // Konversi file ke base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle perubahan input text
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle upload cover image
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file (max 1MB untuk performa)
    if (file.size > 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 1MB");
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({
        ...prev,
        imageSrc: base64,
      }));
      setPreviewImage(base64);
    } catch (error) {
      console.error("Error converting image:", error);
      alert("Gagal memproses gambar");
    }
  };

  // Handle upload logo band
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 512 * 1024) {
      alert("Ukuran logo terlalu besar. Maksimal 512KB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({
        ...prev,
        bandLogo: base64,
      }));
      setPreviewLogo(base64);
    } catch (error) {
      console.error("Error converting logo:", error);
      alert("Gagal memproses logo");
    }
  };

  // Handle upload audio
  const handleAudioUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran audio (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran audio terlalu besar. Maksimal 5MB");
      return;
    }

    if (!file.type.startsWith("audio/")) {
      alert("File harus berupa audio");
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({
        ...prev,
        audioSrc: base64,
      }));
    } catch (error) {
      console.error("Error converting audio:", error);
      alert("Gagal memproses audio");
    }
  };

  // Handle submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validasi
    if (!formData.title || !formData.coverArtist || !formData.imageSrc) {
      alert("Mohon lengkapi field yang wajib diisi");
      setIsLoading(false);
      return;
    }

    try {
      const coversCollection = collection(db, "covers");
      await addDoc(coversCollection, {
        ...formData,
        createdAt: serverTimestamp(),
      });

      alert("Cover berhasil diupload!");
      
      // Reset form
      setFormData({
        title: "",
        originalArtist: "",
        coverArtist: "",
        description: "",
        bandName: "",
        bandLogo: "",
        imageSrc: "",
        audioSrc: "",
      });
      setPreviewImage("");
      setPreviewLogo("");
    } catch (error) {
      console.error("Error uploading cover:", error);
      alert("Gagal mengupload cover");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 font-serif text-3xl font-semibold">Upload New Cover</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Cover Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          {previewImage && (
            <div className="mt-4">
              <Image
                src={previewImage}
                alt="Preview"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>

        {/* Original Artist */}
        <div>
          <label className="mb-2 block text-sm font-medium">Original Artist</label>
          <input
            type="text"
            name="originalArtist"
            value={formData.originalArtist}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        {/* Cover Artist */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Cover Artist <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="coverArtist"
            value={formData.coverArtist}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>

        {/* Band Name */}
        <div>
          <label className="mb-2 block text-sm font-medium">Band Name</label>
          <input
            type="text"
            name="bandName"
            value={formData.bandName}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        {/* Band Logo */}
        <div>
          <label className="mb-2 block text-sm font-medium">Band Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          {previewLogo && (
            <div className="mt-4">
              <Image
                src={previewLogo}
                alt="Logo Preview"
                width={150}
                height={150}
                className="rounded-lg object-contain"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        {/* Audio */}
        <div>
          <label className="mb-2 block text-sm font-medium">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          {formData.audioSrc && (
            <p className="mt-2 text-sm text-green-600">✓ Audio uploaded</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isLoading ? "Uploading..." : "Upload Cover"}
        </button>
      </form>
    </div>
  );
}