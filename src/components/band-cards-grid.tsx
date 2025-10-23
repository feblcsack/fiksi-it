"use client"

import { BandCard } from "./band-card"

interface BandCardsGridProps {
  onSelectBand: (bandId: string) => void
}

const bands = [
  {
    id: "band-1",
    name: "Payung Teduh",
    genre: "Indie Pop",
    members: 4,
    image: "/payung.jpg",
  },
  {
    id: "band-2",
    name: "Tulus",
    genre: "Alternative Rock",
    members: 5,
    image: "/tulus.jpg",
  },
  {
    id: "band-3",
    name: "Kunto Aji",
    genre: "Soul Jazz",
    members: 3,
    image: "/kunto.webp",
  },
  {
    id: "band-4",
    name: "Hindia",
    genre: "Indie Folk",
    members: 4,
    image: "/hindia.jpeg",
  },
  {
    id: "band-5",
    name: "Navicula",
    genre: "Reggae",
    members: 5,
    image: "/navi.webp",
  },
  {
    id: "band-6",
    name: "Sheila On 7",
    genre: "Rock",
    members: 4,
    image: "/sheila.jpeg",
  },
  {
    id: "band-7",
    name: "Efek Rumah Kaca",
    genre: "Alternative",
    members: 4,
    image: "/efek.webp",
  },
  {
    id: "band-8",
    name: "Poris",
    genre: "HipHop",
    members: 3,
    image: "/poris.jpeg",
  },
]

export function BandCardsGrid({ onSelectBand }: BandCardsGridProps) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Explore Bands</h2>
          <p className="text-foreground/60 text-sm sm:text-base">
            Discover and join discussions about your favorite artists
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {bands.map((band, index) => (
            <div
              key={band.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <BandCard band={band} onClick={() => onSelectBand(band.id)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
