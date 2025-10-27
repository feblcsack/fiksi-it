import { Navbar } from "@/components/organisms/Navbar";
import { PlanCard } from "@/components/planCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – Jazz Subscriptions",
  description: "Choose the right plan for your groove.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <h1 className="text-balance font-serif text-4xl tracking-tight md:text-5xl">
            Find your rhythm
          </h1>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            Choose the vibe that fits your flow.
          </p>
        </header>

        <section
          aria-label="Subscription plans"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
        >
          <PlanCard
            name="Premium Plan"
            price="Rp39.900"
            period="/month"
            description="Unlock the full groove experience — no ads, full-quality sound, and more control over your vibe."
            features={[
              "Ad-free listening",
              "High-fidelity audio",
              "Unlimited skips & playlists",
              "Offline mode",
              "Priority feature access",
            ]}
            ctaLabel="Go Premium"
            highlighted
          />

          <PlanCard
            name="Upload Cover"
            price="Rp10.000"
            description="Personalize your tracklist with your own custom cover art — make your vibe truly yours."
            features={[
              "Upload custom cover image",
              "Instant preview before publish",
              "Applies to all your playlists",
            ]}
            ctaLabel="Upload Now"
          />
        </section>

        <footer className="mx-auto mt-12 max-w-3xl text-center text-sm text-muted-foreground md:mt-16">
          Prices in IDR. Cancel anytime. Taxes may apply.
        </footer>
      </main>
    </>
  );
}
