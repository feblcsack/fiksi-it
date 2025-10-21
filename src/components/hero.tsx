import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onSwitchView: (mode: "featured" | "recommended") => void;
}

export function Hero({ onSwitchView }: HeroProps) {
  return (
    <section className="relative py-16 md:py-24" aria-labelledby="hero-title">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <span className="inline-block rounded-full bg-secondary/60 px-3 py-1 text-xs tracking-wide text-secondary-foreground/80">
            Smooth. Minimal. Sophisticated.
          </span>
          <h1
            id="hero-title"
            className="font-serif text-pretty text-4xl font-semibold leading-tight md:text-5xl"
          >
            Timeless cover songs, reimagined in a warm, modern sound.
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-muted-foreground leading-relaxed">
            Discover elegant renditions from emerging artists. Set the mood with
            a curated collection of sophisticated covers—perfect for late nights
            and long listens.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              asChild
              className="min-w-40 transition-transform hover:-translate-y-0.5"
              onClick={() => onSwitchView("featured")}
            >
              <Link href="#featured">Start Listening</Link>
            </Button>
            <Button
              variant="secondary"
              className="min-w-40 transition-transform hover:-translate-y-0.5"
              onClick={() => onSwitchView("recommended")}
            >
              Recommended
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
