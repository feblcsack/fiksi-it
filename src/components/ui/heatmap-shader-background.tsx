"use client"

import { Heatmap } from "@paper-design/shaders-react"
import { useEffect, useState } from "react"

export const HeatmapShaderBackground = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <Heatmap
        width={dimensions.width}
        height={dimensions.height}
        image="/epo.jpeg"
        colors={["#8c8c8c", "#ffffff", "#3265e7", "#6bd8ff", "#ffe77a"]}
        colorBack="#000000"
        contour={0.5}
        angle={0}
        noise={0.75}
        innerGlow={0.5}
        outerGlow={0.5}
        speed={0.5}
        scale={1} // coba set ke 1
        rotation={0}
        offsetX={0}
        offsetY={0}
      />
    </div>
  )
}
