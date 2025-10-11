"use client";

import { useEffect, useState, useRef } from "react";
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

interface CoverPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cover: {
    id: string;
    title: string;
    originalArtist: string;
    coverArtist: string;
    imageSrc: string;
    description: string;
    audioSrc?: string;
    bandName?: string;
    bandLogo?: string;
  } | null;
}

export default function CoverPlayerModal({ isOpen, onClose, cover }: CoverPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

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
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!isOpen || !cover) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Left Side - Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
              <Image
                src={cover.imageSrc}
                alt={cover.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            {cover.bandLogo && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Image
                  src={cover.bandLogo}
                  alt={cover.bandName || "Band"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <span className="font-medium text-gray-900">{cover.bandName}</span>
              </div>
            )}
          </div>

          {/* Right Side - Info & Player */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                  {cover.title}
                </h2>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Cover by:</span> {cover.coverArtist}
                  </p>
                  {cover.originalArtist && (
                    <p className="text-gray-600">
                      <span className="font-medium">Original by:</span> {cover.originalArtist}
                    </p>
                  )}
                </div>
              </div>

              {cover.description && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {cover.description}
                  </p>
                </div>
              )}
            </div>

            {/* Audio Player */}
            {cover.audioSrc && (
              <div className="mt-6 space-y-4">
                <audio ref={audioRef} src={cover.audioSrc} />
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="p-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" fill="currentColor" />
                    ) : (
                      <Play className="w-6 h-6" fill="currentColor" />
                    )}
                  </button>

                  <div className="flex items-center gap-2 flex-1">
                    <button onClick={toggleMute} className="p-2 hover:bg-gray-100 rounded-lg transition">
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {!cover.audioSrc && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-sm text-gray-600">No audio available for this cover</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}