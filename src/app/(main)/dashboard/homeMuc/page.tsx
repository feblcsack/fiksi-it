import type { Metadata } from "next"
import { Hero } from "@/components/hero"
import { CoverCard } from "@/components/cover-card"
import { Navbar } from "@/components/organisms/Navbar"

export const metadata: Metadata = {
  title: "Covers • Listen in Style",
  description: "A minimalist, elegant collection of sophisticated cover songs.",
}

const featured = [
  {
    title: "Autumn Leaves",
    originalArtist: "Joseph Kosma",
    coverArtist: "Lena Hart Trio",
    imageSrc: "/epo.jpg",
    description: "A dusky, intimate rendition with brushed drums and delicate piano voicings.",
    href: "#",
  },
  {
    title: "Blue in Green",
    originalArtist: "Miles Davis",
    coverArtist: "Nocturne Collective",
    imageSrc: "/moody-minimal-album-cover.jpg",
    description: "Minimalist textures and slow-burning harmonies for late-night sessions.",
    href: "#",
  },
  {
    title: "My Funny Valentine",
    originalArtist: "Rodgers & Hart",
    coverArtist: "Etta Cole Quartet",
    imageSrc: "/elegant-classic-vinyl-cover.jpg",
    description: "A warm, velvety vocal with understated bass and gentle cymbal swells.",
    href: "#",
  },
  {
    title: "Round Midnight",
    originalArtist: "Thelonious Monk",
    coverArtist: "Grey Room Ensemble",
    imageSrc: "/monochrome-jazz-cover-art.jpg",
    description: "Sparse, expressive phrasing that lets every note breathe.",
    href: "#",
  },
  {
    title: "Summertime",
    originalArtist: "Gershwin",
    coverArtist: "Amber Lights",
    imageSrc: "/abstract-warm-amber-cover.jpg",
    description: "A dreamy reharmonization with airy guitar voicings and subtle percussion.",
    href: "#",
  },
  {
    title: "Body and Soul",
    originalArtist: "Green/Heyman/Sour/Eyton",
    coverArtist: "Noir Atlas",
    imageSrc: "/minimal-noir-album-cover.jpg",
    description: "Deep, resonant tones and a slow pulse for a late-night glow.",
    href: "#",
  },
]

export default function Page() {
  return (
    <main>
        <Navbar/>
      <Hero />

      <section id="featured" aria-labelledby="featured-heading" className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="mb-6 flex items-end justify-between md:mb-10">
          <div>
            <h2 id="featured-heading" className="font-serif text-2xl font-semibold md:text-3xl">
              Featured Covers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Curated selections with a warm, minimalist aesthetic.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <CoverCard key={item.title} {...item} />
          ))}
        </div>
      </section>
    </main>
  )
}
