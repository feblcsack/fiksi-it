// NotFoundContent.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function NotFoundContent() {
  const params = useSearchParams();
  const ref = params.get("ref");

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      {ref && <p className="text-gray-500 mt-2">Ref: {ref}</p>}
    </div>
  );
}
