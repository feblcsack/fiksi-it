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
            Choose your best plan.
          </p>
        </header>

        <section
          aria-label="Subscription plans"
          className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
        >
          <PlanCard
            name="Intro"
            price="Rp15.000"
            period="/mo"
            description="Start your set with essential features."
            features={[
              "Ad‑light listening",
              "Standard audio quality",
              "Basic queue & playlists",
              "Up to 1 device",
            ]}
            ctaLabel="Get Started"
          />

          <PlanCard
            name="Ensemble"
            price="Rp50.000"
            period="/mo"
            description="A richer mix for regular listeners."
            features={[
              "Ad‑free listening",
              "High‑fidelity audio",
              "Unlimited playlists",
              "Offline mode",
              "Up to 3 devices",
            ]}
            ctaLabel="Subscribe"
            highlighted
          />

          <PlanCard
            name="Headliner"
            price="Rp70.000"
            period="/mo"
            description="Premium sound and priority features."
            features={[
              "Studio‑quality audio",
              "Priority support",
              "Exclusive sessions & drops",
              "Family sharing (5)",
              "Multi‑device sync",
            ]}
            ctaLabel="Subscribe"
          />
        </section>

        <footer className="mx-auto mt-12 max-w-3xl text-center text-sm text-muted-foreground md:mt-16">
          Prices in IDR. Cancel anytime. Taxes may apply.
        </footer>
      </main>
    </>
  );
}
