"use client";

import Image from "next/image";
import { Play } from "lucide-react";

interface CoverCardProps {
  id: string;
  title: string;
  originalArtist: string;
  coverArtist: string;
  imageSrc: string;
  description: string;
  audioSrc?: string;
  bandName?: string;
  bandLogo?: string;
  onClick?: () => void;
}

export function CoverCard({
  title,
  originalArtist,
  coverArtist,
  imageSrc,
  audioSrc,
  onClick,
}: CoverCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:-translate-y-2"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button */}
        {audioSrc && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="p-4 bg-white/90 dark:bg-neutral-900 rounded-full shadow-lg backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-7 h-7 text-neutral-800 dark:text-white" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Info badge (hover reveal) */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md rounded-xl p-3 shadow-md border border-white/10">
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {title}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
              by {coverArtist}
            </p>
          </div>
        </div>
      </div>

      {/* Static info */}
      <div className="mt-4 space-y-1">
        <h3 className="font-medium text-base text-neutral-900 dark:text-white truncate">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Cover:</span>{" "}
          {coverArtist}
        </p>
        {originalArtist && (
          <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate">
            <span className="font-medium">Original:</span> {originalArtist}
          </p>
        )}
      </div>
    </div>
  );
}
