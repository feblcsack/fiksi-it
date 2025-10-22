"use client"

import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-lg sm:text-xl font-bold text-foreground">SoundForum</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition">
              Discover
            </a>
            <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition">
              Discussions
            </a>
            <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition">
              Artists
            </a>
            <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition">
              Events
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              Log in
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
