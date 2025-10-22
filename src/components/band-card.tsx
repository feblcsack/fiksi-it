"use client"

import Image from "next/image"
import { useState } from "react"
import { ArrowRight } from "lucide-react"

interface BandCardProps {
  band: {
    id: string
    name: string
    genre: string
    members: number
    image: string
  }
  onClick: () => void
}

export function BandCard({ band, onClick }: BandCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={band.image || "/placeholder.svg"}
          alt={band.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 text-white">
        <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-2">{band.name}</h3>
        <p className="text-xs sm:text-sm text-white/80 mb-1">{band.genre}</p>
        <p className="text-xs text-white/60">{band.members} members</p>
      </div>

      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-200">
          <div className="text-white text-center flex flex-col items-center gap-2">
            <ArrowRight className="w-6 h-6 animate-pulse" />
            <p className="text-sm font-semibold">View Discussions</p>
          </div>
        </div>
      )}
    </div>
  )
}
