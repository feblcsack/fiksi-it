"use client";

import { useSearchParams } from "next/navigation";

export default function NotFoundContent() {
  const params = useSearchParams();
  const ref = params.get("ref");

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2">404 - Not Found</h1>
      {ref && <p className="text-gray-500">Ref: {ref}</p>}
    </div>
  );
}
