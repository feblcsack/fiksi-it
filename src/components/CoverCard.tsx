// src/components/CoverCard.tsx
import React from "react";



type Props = {
  coverArtist: string;
  originalTitle: string;
  originalArtist: string;
  coverAudioUrl: string;
  spotifyUrl?: string | null;
};

export const CoverCard: React.FC<Props> = ({
  coverArtist,
  originalTitle,
  originalArtist,
  coverAudioUrl,
  spotifyUrl,
}) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-bold">{coverArtist}</h3>
        <p className="text-sm text-neutral-400">
          Mengcover: {originalTitle} - {originalArtist}
        </p>
      </div>
      <audio controls src={coverAudioUrl} className="w-full" />
      {spotifyUrl ? (
        <iframe
          src={spotifyUrl}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
        ></iframe>
      ) : (
        <p className="text-neutral-500 text-sm">
          Lagu original tidak ditemukan di Spotify
        </p>
      )}
    </div>
  );
};
