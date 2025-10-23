import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "./Providers"; // Client wrapper
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import RouteProgress from "@/components/RouteProgress"; // NProgress wrapper

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "musionic",
  description:
    "Discover live gigs nearby and create music effortlessly. From idea to sound in seconds with WAV0 AI Music Studio.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/wav0-icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* ✅ Preconnect dan Preload untuk performa font dan logo */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preload" as="image" href="/musionic.png" />

        {/* ✅ Meta viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
      </head>

      <body
        className={`m-0 p-0 h-full w-full antialiased font-sans ${inter.variable} ${playfair.variable}`}
      >
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            {/* Skip link aksesibilitas */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow-lg"
            >
              Skip to content
            </a>

            {/* Provider client */}
            <Providers>{children}</Providers>
          </Suspense>

          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
