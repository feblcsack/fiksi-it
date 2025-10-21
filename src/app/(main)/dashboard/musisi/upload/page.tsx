"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Upload, Music, Image as ImageIcon, X, Sparkles, Headphones, Mic2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Navbar } from "@/components/organisms/Navbar";

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

  const clearPreview = (type: "image" | "logo") => {
    setPreview((prev) => ({ ...prev, [type]: "" }));
    setFormData((prev) => ({ 
      ...prev, 
      [type === "image" ? "imageSrc" : "bandLogo"]: "" 
    }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Navbar/>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6 items-start mt-20">
        {/* Left Side - Info Panel */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-full">
              <span className="text-sm text-zinc-300">Share Your Music</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white leading-tight">
              Showcase Your<br />
              <span className="text-zinc-400">Cover Songs</span>
            </h1>
            
            <p className="text-zinc-500 text-lg max-w-md">
              Upload and share your music covers with the community. Let your talent shine through every note.
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">High Quality Audio</h3>
                <p className="text-zinc-500 text-sm">Upload your best recordings up to 5MB</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <Mic2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Artist Recognition</h3>
                <p className="text-zinc-500 text-sm">Credit original artists and showcase your interpretation</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Visual Appeal</h3>
                <p className="text-zinc-500 text-sm">Add stunning cover art and band logos</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900">
            <p className="text-zinc-600 text-sm">
              Join thousands of artists sharing their passion
            </p>
          </div>
        </div>

        {/* Right Side - Upload Form */}
        <Card className="bg-zinc-900 border-zinc-800 h-[calc(100vh-3rem)] flex flex-col">
          <CardHeader className="flex-shrink-0 border-b border-zinc-800">
            <CardTitle className="text-2xl font-bold text-white">
              Upload Cover
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Fill in the details below to share your cover
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div onSubmit={handleSubmit} className="space-y-6 pb-4">
              {/* Cover Image */}
              <div className="space-y-2">
                <Label className="text-zinc-200">
                  Cover Image <span className="text-red-500">*</span>
                </Label>
                {!preview.image ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 hover:bg-zinc-800/50 transition-colors">
                    <ImageIcon className="w-8 h-8 text-zinc-500 mb-2" />
                    <span className="text-sm text-zinc-500">Click to upload image</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, "imageSrc", "image", "image/", 1)}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-64">
                    <img
                      src={preview.image}
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => clearPreview("image")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-zinc-200">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter song title"
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600"
                />
              </div>

              {/* Original Artist */}
              <div className="space-y-2">
                <Label htmlFor="originalArtist" className="text-zinc-200">
                  Original Artist
                </Label>
                <Input
                  id="originalArtist"
                  name="originalArtist"
                  value={formData.originalArtist}
                  onChange={handleChange}
                  placeholder="Who wrote this song?"
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600"
                />
              </div>

              {/* Cover Artist */}
              <div className="space-y-2">
                <Label htmlFor="coverArtist" className="text-zinc-200">
                  Cover Artist <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="coverArtist"
                  name="coverArtist"
                  value={formData.coverArtist}
                  onChange={handleChange}
                  required
                  placeholder="Your name or artist name"
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600"
                />
              </div>

              {/* Band Name */}
              <div className="space-y-2">
                <Label htmlFor="bandName" className="text-zinc-200">
                  Band Name
                </Label>
                <Input
                  id="bandName"
                  name="bandName"
                  value={formData.bandName}
                  onChange={handleChange}
                  placeholder="Your band name (optional)"
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600"
                />
              </div>

              {/* Band Logo */}
              <div className="space-y-2">
                <Label className="text-zinc-200">Band Logo</Label>
                {!preview.logo ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 hover:bg-zinc-800/50 transition-colors">
                    <ImageIcon className="w-6 h-6 text-zinc-500 mb-2" />
                    <span className="text-sm text-zinc-500">Click to upload logo</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, "bandLogo", "logo", "image/", 0.5)}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                ) : (
                  <div className="relative w-32 h-32">
                    <img
                      src={preview.logo}
                      alt="Logo preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => clearPreview("logo")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-zinc-200">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about this cover..."
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600 resize-none"
                />
              </div>

              {/* Audio File */}
              <div className="space-y-2">
                <Label className="text-zinc-200">Audio File</Label>
                <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 hover:bg-zinc-800/50 transition-colors">
                  <Music className="w-6 h-6 text-zinc-500 mb-2" />
                  <span className="text-sm text-zinc-500">
                    {formData.audioSrc ? "✓ Audio uploaded" : "Click to upload audio"}
                  </span>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "audioSrc", undefined, "audio/", 5)}
                    className="hidden"
                    accept="audio/*"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-zinc-200"
              >
                {isLoading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Cover
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}