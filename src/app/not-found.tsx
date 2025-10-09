import React, { Suspense } from 'react';
import NotFoundClient from './NotFoundClient';

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div>
          <h1>404 - Halaman Tidak Ditemukan</h1>
          <p>Loading...</p>
        </div>
      }
    >
      <NotFoundClient />
    </Suspense>
  );
}
