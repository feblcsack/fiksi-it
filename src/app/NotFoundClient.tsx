'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function NotFoundClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  return (
    <div className="not-found-container">
      <h1>404 - Halaman Tidak Ditemukan</h1>
      <p>Maaf, halaman yang Anda cari tidak ada.</p>
      {code && <p>Kode error: {code}</p>}
    </div>
  );
}
