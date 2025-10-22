"use client"

import { Navigation } from "./navigation"
import { HeroSection } from "./hero-section"
import { BandCardsGrid } from "./band-cards-grid"
import { HeroFirst } from "./hero-first"
import { Navbar } from "./organisms/Navbar"

interface LandingPageProps {
  onSelectBand: (bandId: string) => void
}

export function LandingPage({ onSelectBand }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <HeroFirst/>
      <BandCardsGrid onSelectBand={onSelectBand} />
    </div>
  )
}
