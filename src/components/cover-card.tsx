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
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-md group-hover:shadow-2xl transition-shadow duration-300">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        {audioSrc && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-4 bg-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-8 h-8 text-black" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Info Badge */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {title}
            </h3>
            <p className="text-xs text-gray-600 truncate">
              by {coverArtist}
            </p>
          </div>
        </div>
      </div>

      {/* Static Info (always visible) */}
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-lg font-semibold text-gray-900 truncate">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Cover:</span> {coverArtist}
        </p>
        {originalArtist && (
          <p className="text-xs text-gray-500">
            <span className="font-medium">Original:</span> {originalArtist}
          </p>
        )}
      </div>
    </div>
  );
}