"use client";

import DomeGallery from "../components/DomeGallery";
import Link from "next/link";

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Gallery */}
      <div className="absolute inset-0">
        <DomeGallery />
      </div>

      <div className="relative z-50 w-full h-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="relative z-10 text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-6xl font-light tracking-tight text-white font-lora">
              Live Music
            </h1>

            <p className="text-white/60 text-lg font-light tracking-wide">
              Discover performances near you
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/auth?mode=login"
              className="bg-white text-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-white/90 transition-all"
            >
              LOGIN
            </Link>
            <Link
              href="/auth?mode=register"
              className="bg-transparent border border-white text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-white/10 transition-all"
            >
              REGISTER
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
