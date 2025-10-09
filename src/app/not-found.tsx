"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy-load komponen yang pakai useSearchParams biar gak di-render saat build
const NotFoundContent = dynamic(() => import("./NotFoundContent"), {
  ssr: false, // <== ini kuncinya biar ga di-render di server
});

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
