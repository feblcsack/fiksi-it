// src/app/Providers.tsx
"use client";

import { Suspense } from "react";
import { AuthProvider } from "@/lib/hooks/useAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthProvider>{children}</AuthProvider>
    </Suspense>
  );
}
