// app/not-found.tsx

import React, { Suspense } from 'react';
import NotFoundClient from './NotFoundClient'; // Sesuaikan path jika perlu

// Ini adalah Server Component yang membungkus Client Component
export default function NotFound(): React.ReactElement {
  // Konten fallback ini akan dirender di server saat proses build
  const fallbackContent = (
    <div>
      <h1>404 - Halaman Tidak Ditemukan</h1>
      <p>Maaf, halaman yang Anda cari tidak ada.</p>
    </div>
  );

  return (
    <Suspense fallback={fallbackContent}>
      <NotFoundClient />
    </Suspense>
  );
}