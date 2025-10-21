'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NotFoundClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-950 to-zinc-900 text-white px-6 text-center relative overflow-hidden">
      {/* Floating paw prints */}
      <div className="absolute inset-0 pointer-events-none opacity-10 select-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-4xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            🐾
          </span>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 z-10">
        {/* 404 custom display */}
        <div className="flex items-center justify-center text-[6rem] font-extrabold">
          <span className="text-white drop-shadow-lg">4</span>
          <video
            src="https://framerusercontent.com/assets/Nr0fUAwZa4CAqtH8QqnOHL6Skk.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-32 h-32 mx-3 rounded-full object-cover shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          />
          <span className="text-white drop-shadow-lg">4</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">
          Oops... The cat broke this page!
        </h1>
        <p className="text-zinc-400 text-lg max-w-md">
          Our little feline friend just walked across the keyboard and deleted this page 🐱💻  
          Maybe head <span className="text-white font-semibold">back home</span> before it naps on your cursor.
        </p>

        {code && (
          <p className="text-sm text-zinc-500 mt-2">
            Error Code: <span className="text-zinc-300">{code}</span>
          </p>
        )}

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-6 py-2 rounded-full hover:bg-zinc-700 transition-colors duration-300"
        >
           Go Home
        </Link>
      </div>

      <p className="mt-10 text-zinc-600 text-sm italic z-10">
        “If you were a webpage, I’d never lose you — unlike this one.” 
      </p>
    </div>
  );
}
