"use client"

import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { HeatmapShaderBackground } from "./ui/heatmap-shader-background"
import HeroContent from "./hero-content"

// Skeleton untuk HeroSection
function SkeletonHero() {
  return (
    <div className="relative w-full min-h-[80vh] md:w-[85vw] md:h-[75vh] md:max-w-5xl md:rounded-2xl md:border md:border-border overflow-hidden flex flex-col items-center justify-center gap-4 bg-slate-800 animate-pulse">
      <div className="h-12 md:h-16 w-3/4 bg-slate-600 rounded-lg" />
      <div className="h-12 md:h-16 w-2/3 bg-slate-600 rounded-lg" />
      <div className="h-4 w-5/6 bg-slate-700 rounded" />
      <div className="h-4 w-4/6 bg-slate-700 rounded" />
      <div className="flex gap-4 mt-6">
        <div className="h-12 w-32 bg-slate-600 rounded-full" />
        <div className="h-12 w-32 bg-slate-600 rounded-full" />
      </div>
    </div>
  )
}

export function HeroSection() {
  const ref = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulasi loading selama 1.2 detik
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="min-h-screen relative flex items-center justify-center p-4 md:p-8 bg-background"
      ref={ref}
    >
      <div className="relative w-full min-h-[80vh] md:w-[85vw] md:h-[75vh] md:max-w-5xl md:rounded-2xl md:border md:border-border overflow-hidden flex items-center justify-center">
        <HeatmapShaderBackground />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-8 md:px-16 w-full max-w-4xl relative z-20 flex items-center justify-center min-h-full"
        >
          {loading ? <SkeletonHero /> : <HeroContent />}
        </motion.div>
      </div>
    </section>
  )
}
