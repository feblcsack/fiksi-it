'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NotFoundClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
          alt="Lost cat icon"
          width={120}
          height={120}
          className="opacity-90"
        />
        <h1 className="text-5xl font-bold">404 – Page Not Found</h1>
        <p className="text-zinc-400 text-lg max-w-md">
          Uh oh... looks like our cat walked over the keyboard again 🐾 
          Maybe try going <span className="text-white font-semibold">back home</span> before it happens again.
        </p>
        {code && (
          <p className="text-sm text-zinc-500">
            Error Code: <span className="text-zinc-300">{code}</span>
          </p>
        )}
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-5 py-2 rounded-full hover:bg-zinc-800 transition-colors"
        >
           Go Home
        </Link>
      </div>
      <p className="mt-10 text-zinc-600 text-sm italic">
        “If you were a webpage, I’d never lose you.” 
      </p>
    </div>
  );
}
