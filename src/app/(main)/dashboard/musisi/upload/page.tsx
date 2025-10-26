"use client";

import { useState, ChangeEvent, useRef, useEffect } from "react";
import {
  Upload,
  Music,
  ImageIcon,
  X,
  Check,
  Loader2,
  Play,
  Pause,
} from "lucide-react";
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
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [formData.audioSrc]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const convertToBase64 = (
    file: File,
    onProgress?: (progress: number) => void
  ) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      };

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
    maxSizeMB = 5
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateFile(file, type, maxSizeMB);
    if (error) return alert(error);

    try {
      setUploadProgress((prev) => ({ ...prev, [key]: 0 }));

      const base64 = await convertToBase64(file, (progress) => {
        setUploadProgress((prev) => ({ ...prev, [key]: progress }));
      });

      setFormData((prev) => ({ ...prev, [key]: base64 }));
      if (previewKey) setPreview((prev) => ({ ...prev, [previewKey]: base64 }));

      setTimeout(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[key];
          return newProgress;
        });
      }, 1000);
    } catch {
      alert("Gagal memproses file");
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[key];
        return newProgress;
      });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
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
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
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
      [type === "image" ? "imageSrc" : "bandLogo"]: "",
    }));
  };

  const clearAudio = () => {
    setFormData((prev) => ({ ...prev, audioSrc: "" }));
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <>
      <div className="fixed top-0 w-full z-20">
        <Navbar />
      </div>
      <div className="min-h-screen mt-20 bg-[#0a0a0a] relative overflow-hidden">
        {/* Subtle Jazz-inspired background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8b7355] opacity-[0.02] blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            {/* Left Section - Elegant Typography */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                {/* Decorative line */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-primary" />
                  <span className="text-primary text-xs tracking-[0.3em] uppercase font-light">
                    Upload
                  </span>
                </div>

                <h1 className="text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight">
                  Share Your
                  <span className="block text-primary italic font-serif mt-2">
                    Music Covers
                  </span>
                </h1>

                <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-md">
                  Every note tells a story. Upload your interpretation and let
                  the rhythm speak.
                </p>
              </div>

              {/* Minimalist Feature Cards */}
              <div className="space-y-6 pt-8">
                <div className="group">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-zinc-900 bg-zinc-950/30 hover:border-primary/20 transition-all duration-500">
                    <div className="w-1 h-12 bg-primary/50 rounded-full group-hover:h-16 transition-all duration-500" />
                    <div className="flex-1">
                      <h3 className="text-white font-light text-sm mb-1 tracking-wide">
                        High Fidelity
                      </h3>
                      <p className="text-zinc-600 text-xs font-light">
                        Audio files up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-zinc-900 bg-zinc-950/30 hover:border-primary/20 transition-all duration-500">
                    <div className="w-1 h-12 bg-primary/50 rounded-full group-hover:h-16 transition-all duration-500" />
                    <div className="flex-1">
                      <h3 className="text-white font-light text-sm mb-1 tracking-wide">
                        Artist Credit
                      </h3>
                      <p className="text-zinc-600 text-xs font-light">
                        Honor the original composers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-zinc-900 bg-zinc-950/30 hover:border-primary/20 transition-all duration-500">
                    <div className="w-1 h-12 bg-primary/50 rounded-full group-hover:h-16 transition-all duration-500" />
                    <div className="flex-1">
                      <h3 className="text-white font-light text-sm mb-1 tracking-wide">
                        Visual Identity
                      </h3>
                      <p className="text-zinc-600 text-xs font-light">
                        Showcase your aesthetic
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="pt-12 border-t border-zinc-900/50">
                <p className="text-zinc-700 text-sm italic font-light leading-relaxed">
                “If it doesn’t make your hands shake and your heart race, it ain’t music — it’s just noise.”
                </p>
                <p className="text-primary/50 text-xs mt-2 tracking-wider">
                 <i>— Inspired by Whiplash (2014)</i>
                </p>
              </div>
            </div>

            {/* Right Section - Minimalist Form */}
            <div className="lg:col-span-3">
              <div className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-900/50 rounded-2xl p-8 lg:p-12">
                <div className="space-y-8">
                  {/* Cover Image - Large and Elegant */}
                  <div className="space-y-3">
                    <label className="text-zinc-400 text-xs tracking-wider uppercase font-light">
                      Cover Art <span className="text-primary">*</span>
                    </label>
                    {!preview.image ? (
                      <label className="group relative flex flex-col items-center justify-center w-full aspect-[4/3] border border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-primary/30 transition-all duration-500 bg-zinc-950/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent rounded-xl transition-all duration-500" />
                        <ImageIcon className="w-10 h-10 text-zinc-800 mb-3 group-hover:text-primary/50 transition-colors duration-500" />
                        <span className="text-sm text-zinc-700 font-light group-hover:text-zinc-600 transition-colors">
                          Click to select image
                        </span>
                        <span className="text-xs text-zinc-800 mt-1 font-light">
                          Max 5MB
                        </span>
                        {uploadProgress.imageSrc !== undefined && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 rounded-b-xl overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${uploadProgress.imageSrc}%` }}
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "imageSrc",
                              "image",
                              "image/",
                              5
                            )
                          }
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    ) : (
                      <div className="relative w-full aspect-[4/3] group">
                        <img
                          src={preview.image}
                          alt="Cover preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => clearPreview("image")}
                            className="p-3 bg-red-500/20 border border-red-500/30 rounded-full hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                        <div className="absolute top-3 right-3 bg-primary/90 text-black px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Uploaded
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title & Original Artist - Side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-zinc-400 text-xs tracking-wider uppercase font-light">
                        Song Title <span className="text-primary">*</span>
                      </label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("title")}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="Enter title"
                        className={`w-full bg-transparent border-b-2 ${
                          focusedField === "title"
                            ? "border-primary"
                            : "border-zinc-800"
                        } text-white px-0 py-3 text-lg font-light placeholder-zinc-800 focus:outline-none transition-colors duration-300`}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-zinc-400 text-xs tracking-wider uppercase font-light">
                        Original Artist
                      </label>
                      <input
                        name="originalArtist"
                        value={formData.originalArtist}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("originalArtist")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Composer"
                        className={`w-full bg-transparent border-b-2 ${
                          focusedField === "originalArtist"
                            ? "border-primary"
                            : "border-zinc-800"
                        } text-white px-0 py-3 text-lg font-light placeholder-zinc-800 focus:outline-none transition-colors duration-300`}
                      />
                    </div>
                  </div>

                  {/* Cover Artist & Band Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-zinc-400 text-xs tracking-wider uppercase font-light">
                        Cover Artist <span className="text-primary">*</span>
                      </label>
                      <input
                        name="coverArtist"
                        value={formData.coverArtist}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("coverArtist")}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="Your name"
                        className={`w-full bg-transparent border-b-2 ${
                          focusedField === "coverArtist"
                            ? "border-primary"
                            : "border-zinc-800"
                        } text-white px-0 py-3 text-lg font-light placeholder-zinc-800 focus:outline-none transition-colors duration-300`}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-zinc-400 text-xs tracking-wider uppercase font-light">
                        Band Name
                      </label>
                      <input
                        name="bandName"
                        value={formData.bandName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("bandName")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Optional"
                        className={`w-full bg-transparent border-b-2 ${
                          focusedField === "bandName"
                            ? "border-primary"
                            : "border-zinc-800"
                        } text-white px-0 py-3 text-lg font-light placeholder-zinc-800 focus:outline-none transition-colors duration-300`}
                      />
                    </div>
                  </div>

                  {/* Band Logo - Compact */}
                  <div className="space-y-3">
                    <label className="text-zinc-400 text-xs tracking-wider uppercase font-light">
                      Band Logo
                    </label>
                    {!preview.logo ? (
                      <label className="group relative flex items-center gap-4 p-4 border border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-primary/30 transition-all duration-500 bg-zinc-950/30">
                        <div className="w-16 h-16 rounded-lg bg-zinc-900/50 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                          <ImageIcon className="w-6 h-6 text-zinc-700 group-hover:text-primary/50 transition-colors" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-600 font-light">
                            Upload band logo
                          </p>
                          <p className="text-xs text-zinc-800 font-light mt-0.5">
                            Max 5MB
                          </p>
                        </div>
                        {uploadProgress.bandLogo !== undefined && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 rounded-b-xl overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${uploadProgress.bandLogo}%` }}
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileUpload(e, "bandLogo", "logo", "image/", 5)
                          }
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    ) : (
                      <div className="relative flex items-center gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-950/30 group">
                        <img
                          src={preview.logo}
                          alt="Logo"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-white font-light">
                            Logo uploaded
                          </p>
                          <p className="text-xs text-zinc-600 font-light mt-0.5">
                            Click to change
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => clearPreview("logo")}
                          className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="text-zinc-400 text-xs tracking-wider uppercase font-light">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("description")}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      placeholder="Share the story behind your cover..."
                      className={`w-full bg-transparent border ${
                        focusedField === "description"
                          ? "border-primary"
                          : "border-zinc-800"
                      } rounded-xl text-white p-4 text-sm font-light placeholder-zinc-800 focus:outline-none transition-colors duration-300 resize-none`}
                    />
                  </div>

                  {/* Audio File - Enhanced Player */}
                  <div className="space-y-3">
                    <label className="text-zinc-400 text-xs tracking-wider uppercase font-light">
                      Audio File
                    </label>
                    {!formData.audioSrc ? (
                      <label className="group relative flex flex-col items-center justify-center w-full h-32 border border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-primary/30 transition-all duration-500 bg-zinc-950/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent rounded-xl transition-all duration-500" />
                        <Music className="w-8 h-8 text-zinc-800 mb-2 group-hover:text-primary/50 transition-colors duration-500" />
                        <span className="text-sm text-zinc-700 font-light group-hover:text-zinc-600 transition-colors">
                          Upload your track
                        </span>
                        <span className="text-xs text-zinc-800 mt-1 font-light">
                          MP3, WAV up to 5MB
                        </span>
                        {uploadProgress.audioSrc !== undefined && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 rounded-b-xl overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${uploadProgress.audioSrc}%` }}
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "audioSrc",
                              undefined,
                              "audio/",
                              5
                            )
                          }
                          className="hidden"
                          accept="audio/*"
                        />
                      </label>
                    ) : (
                      <div className="border border-zinc-800 rounded-xl bg-zinc-950/30 p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <button
                            type="button"
                            onClick={togglePlayPause}
                            className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5 text-primary" />
                            ) : (
                              <Play className="w-5 h-5 text-primary ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className="text-white text-sm font-light mb-1">
                              Audio Ready
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all duration-100"
                                  style={{
                                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-zinc-600 font-light tabular-nums">
                                {formatTime(currentTime)} /{" "}
                                {formatTime(duration)}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={clearAudio}
                            className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                        <audio ref={audioRef} src={formData.audioSrc} />
                      </div>
                    )}
                  </div>

                  {/* Submit Button - Elegant */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="group relative w-full bg-primary text-black py-4 rounded-xl font-light tracking-wider uppercase text-sm hover:bg-[#c9a632] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <div className="relative flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Share Your Cover</span>
                          </>
                        )}
                      </div>
                    </button>

                    <p className="text-center text-zinc-700 text-xs font-light mt-4">
                      By uploading, you agree to credit the original artist
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
