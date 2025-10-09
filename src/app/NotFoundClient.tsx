// components/NotFoundClient.tsx

'use client'; // <-- WAJIB! Menandakan ini adalah Client Component

import { useSearchParams } from 'next/navigation';
import React from 'react';

// Komponen ini akan dirender di sisi klien
export default function NotFoundClient(): React.ReactElement {
  const searchParams = useSearchParams();
  // .get() akan mengembalikan tipe `string | null`, yang sudah type-safe
  const someParam = searchParams.get('ref');

  return (
    <div>
      <h1>404 - Halaman Tidak Ditemukan</h1>
      <p>Maaf, halaman yang Anda cari tidak ada.</p>
      {/* Cek `someParam` akan bekerja dengan baik karena TS tahu itu bisa `null` */}
      {someParam && <p>Referensi: {someParam}</p>}
    </div>
  );
}