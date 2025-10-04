import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MusicianHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-start gap-6 text-pretty">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Share your signature sound
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A refined space for musicians to publish cover songs—crafted with a warm, minimalist aesthetic that lets
            your music take center stage.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="bg-primary text-primary-foreground hover:opacity-95 transition-opacity">
              <Link href="/upload" aria-label="Upload a new cover">
                Upload Cover
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border text-foreground hover:bg-primary/10 hover:text-foreground transition-colors bg-transparent"
            >
              <Link href="/dashboard" aria-label="Manage your portfolio">
                Manage Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
