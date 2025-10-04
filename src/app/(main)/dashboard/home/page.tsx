import type { Metadata } from "next"
import Link from "next/link"
import { MusicianHero } from "@/components/musician-hero"
import { MusicianUploadCard } from "@/components/musician-upload-card"
import { Navbar } from "@/components/organisms/Navbar"

export const metadata: Metadata = {
  title: "Home",
  description: "A refined space for musicians to upload and manage their cover songs.",
}

const featuredUploads = [
  {
    id: "1",
    title: "Autumn Leaves (Lo-Fi Trio)",
    musician: "Maya Coltrane",
    description: "A warm, intimate take with brushed drums and felt piano textures. Recorded live in one take.",
    imageSrc: "/epo.jpeg",
    imageAlt: "Warm jazz album cover with minimal, abstract pattern.",
  },
  {
    id: "2",
    title: "Blue in Green (Solo Guitar)",
    musician: "J. Navarro",
    description: "Sparse harmonics and lingering voicings—an understated homage to a timeless mood.",
    imageSrc: "/epo.jpeg",
    imageAlt: "Minimal noir album cover with geometric shapes.",
  },
  {
    id: "3",
    title: "Round Midnight (Keys & Tape)",
    musician: "Elise Hart",
    description: "Tape-saturated Rhodes and soft noise floor for a late-night, smoke-hued ambience.",
    imageSrc: "/epo.jpeg",
    imageAlt: "Abstract warm amber-toned album cover.",
  },
  {
    id: "4",
    title: "So What (Bass & Brush)",
    musician: "Luca Verde",
    description: "Laid-back bass motifs and airy brushwork—space becomes the groove.",
    imageSrc: "/epo.jpeg",
    imageAlt: "Monochrome jazz cover art with clean typography.",
  },
  {
    id: "5",
    title: "My Funny Valentine (Vocal Duet)",
    musician: "Ava & Theo",
    description: "Soft dual vocals over muted trumpet textures for a slow-burn glow.",
    imageSrc: "/epo.jpeg",
    imageAlt: "Elegant classic vinyl-style cover art.",
  },
  {
    id: "6",
    title: "Misty (Piano Sketch)",
    musician: "R. Saito",
    description: "Felted upright and close mic placement—every pedal breath audible.",
    imageSrc: "/epo.jpeg",
    imageAlt: "Moody minimal album cover with abstract texture.",
  },
]

export default function MusiciansPage() {
  return (
    <main className="bg-background text-foreground">
        <Navbar/>
      <MusicianHero />

      <section aria-label="Musician actions" className="border-y border-border/60">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Ready to publish your next cover? Keep your portfolio organized and up to date.
          </p>
          <div className="flex gap-3">
            <Link
              href="/dashboard/musisi"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-95"
              aria-label="Upload a new cover"
            >
              Upload Cover
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10"
              aria-label="Go to your portfolio dashboard"
            >
              Manage Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Featured uploads */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">Featured Uploads</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Handpicked covers from the community—minimalist, warm, and full of character.
            </p>
          </div>
          <Link
            href="/dashboard/homeMuc"
            className="hidden rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-primary/10 md:inline-block"
          >
            Explore All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredUploads.map((u) => (
            <div key={u.id} className="h-full">
              <MusicianUploadCard upload={u} />
            </div>
          ))}
        </div>

        {/* Mobile Explore CTA */}
        <div className="mt-10 md:hidden">
          <Link
            href="/explore"
            className="block w-full rounded-md border border-border px-4 py-2 text-center text-sm text-foreground transition-colors hover:bg-primary/10"
          >
            Explore All
          </Link>
        </div>
      </section>
    </main>
  )
}
