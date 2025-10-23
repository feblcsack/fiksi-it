"use client"

import { Button } from "@/components/ui/button"

export function HeroFirst() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-4xl mx-auto text-center mt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-accent/20 text-accent mb-6 sm:mb-8 text-xs sm:text-sm">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          <span className="font-medium text-neutral-600">Join thousands of music enthusiasts</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
          The world's destination for <span className="text-primary">music discussion</span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-foreground/70 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect with passionate musicians and fans. Discover new sounds, share your thoughts, and be part of a vibrant
          global music community.
        </p>

        {/* CTA Button */}
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base">
          Explore Communities
        </Button>
      </div>
    </section>
  )
}
