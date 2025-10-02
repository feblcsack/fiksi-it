

import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthProvider } from "@/lib/hooks/useAuth";
import "./globals.css";

// Fonts
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "GigFinder",
  description: "Discover local live gigs",
  generator: "v0.app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} ${playfair.variable} antialiased`}>
        <Suspense fallback={null}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
