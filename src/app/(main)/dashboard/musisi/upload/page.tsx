"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Music, Image as ImageIcon } from "lucide-react";
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
  const [preview, setPreview] = useState({ image: "", logo: "" });
  const [isLoading, setIsLoading] = useState(false);

  const convertToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const validateFile = (file: File, type: string, maxSizeMB: number) => {
    if (!file.type.startsWith(type)) return `File harus berupa ${type}`;
    if (file.size > maxSizeMB * 1024 * 1024)
      return `Ukuran file maksimal ${maxSizeMB}MB`;
    return null;
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof FormData,
    previewKey?: "image" | "logo",
    type = "image/",
    maxSizeMB = 1
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateFile(file, type, maxSizeMB);
    if (error) return alert(error);

    try {
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({ ...prev, [key]: base64 }));
      if (previewKey) setPreview((prev) => ({ ...prev, [previewKey]: base64 }));
    } catch {
      alert("Gagal memproses file");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { title, coverArtist, imageSrc } = formData;
    if (!title || !coverArtist || !imageSrc)
      return alert("Mohon lengkapi field yang wajib diisi");

    setIsLoading(true);
    try {
      await addDoc(collection(db, "covers"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      alert("Cover berhasil diupload!");
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
      setPreview({ image: "", logo: "" });
    } catch (err) {
      console.error(err);
      alert("Gagal mengupload cover");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl"
      >
        <h1 className="mb-2 text-4xl font-bold text-white tracking-tight">
          Upload <span className="text-indigo-400">Your Cover</span>
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Share your latest music or band performance 🎵
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUpload
            label="Cover Image"
            icon={<ImageIcon className="text-indigo-400 w-6 h-6" />}
            onChange={(e) => handleFileUpload(e, "imageSrc", "image", "image/", 1)}
            preview={preview.image}
            required
          />

          <Input
            label="Title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
          />

          <Input
            label="Original Artist"
            name="originalArtist"
            value={formData.originalArtist}
            onChange={handleChange}
          />

          <Input
            label="Cover Artist"
            name="coverArtist"
            required
            value={formData.coverArtist}
            onChange={handleChange}
          />

          <Input
            label="Band Name"
            name="bandName"
            value={formData.bandName}
            onChange={handleChange}
          />

          <FileUpload
            label="Band Logo"
            icon={<ImageIcon className="text-purple-400 w-6 h-6" />}
            onChange={(e) =>
              handleFileUpload(e, "bandLogo", "logo", "image/", 0.5)
            }
            preview={preview.logo}
            small
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <FileUpload
            label="Audio File"
            icon={<Music className="text-green-400 w-6 h-6" />}
            onChange={(e) => handleFileUpload(e, "audioSrc", undefined, "audio/", 5)}
          />
          {formData.audioSrc && (
            <p className="text-sm text-green-500">✓ Audio uploaded</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-40"
          >
            {isLoading ? "Uploading..." : "Upload Cover"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* --- Reusable Components --- */
const Input = ({ label, name, value, onChange, required }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
    />
  </div>
);

const FileUpload = ({ label, icon, onChange, preview, small, required }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-white/20 hover:border-indigo-400 transition p-6 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10">
      {icon}
      <p className="text-gray-400 text-sm mt-2">Click or drag file to upload</p>
      <input type="file" onChange={onChange} className="hidden" />
    </label>

    {preview && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4"
      >
        <Image
          src={preview}
          alt="Preview"
          width={small ? 150 : 300}
          height={small ? 150 : 300}
          className="rounded-lg object-cover border border-white/10"
        />
      </motion.div>
    )}
  </div>
);
