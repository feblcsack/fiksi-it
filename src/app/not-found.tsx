"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NotFoundContent() {
  const params = useSearchParams();
  const code = params.get("code");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-2">404 - Not Found</h1>
      <p className="text-gray-400">
        {code ? `Error code: ${code}` : "The page you're looking for doesn't exist."}
      </p>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
