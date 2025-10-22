"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { ForumView } from "@/components/forum-view"

export default function Home() {
  const [selectedBand, setSelectedBand] = useState<string | null>(null)

  if (selectedBand) {
    return <ForumView bandId={selectedBand} onBack={() => setSelectedBand(null)} />
  }

  return <LandingPage onSelectBand={setSelectedBand} />
}
