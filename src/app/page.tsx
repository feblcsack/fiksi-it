"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { Music, MapPin, Shuffle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Dynamic imports dengan wrapper untuk named exports
const HeroSection = lazy(() => 
  import("@/components/hero-section").then(module => ({ default: module.HeroSection }))
);
const FeatureSection = lazy(() => 
  import("@/components/feature-section").then(module => ({ default: module.FeatureSection }))
);
const Footer = lazy(() => 
  import("@/components/footer").then(module => ({ default: module.Footer }))
);
const ChatPill = lazy(() => 
  import("@/components/chat-pill").then(module => ({ default: module.ChatPill }))
);
const DynamicBackground = lazy(() => 
  import("@/components/dynamic-background").then(module => ({ default: module.DynamicBackground }))
);
const Navbar = lazy(() => 
  import("@/components/organisms/Navbar").then(module => ({ default: module.Navbar }))
);

// Reusable Skeleton Components (optimized)
function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-600 animate-pulse rounded ${className}`} />
  );
}

function SkeletonText({ width = "w-full" }: { width?: string }) {
  return <div className={`h-4 ${width} bg-slate-600 animate-pulse rounded`} />;
}

// Loading States (simplified animations)
const LoadingNavbar = () => (
  <div className="bg-slate/80 backdrop-blur-sm border-b border-slate-600/50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <SkeletonBox className="h-5 w-24" />
        <div className="hidden md:flex items-center gap-6">
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-8 w-20 rounded-full" />
        </div>
        <SkeletonBox className="md:hidden h-6 w-6" />
      </div>
    </div>
  </div>
);

const LoadingHero = () => (
  <section className="relative px-4 py-20 md:py-32">
    <div className="container mx-auto max-w-5xl text-center">
      <div className="space-y-4 mb-8">
        <SkeletonBox className="h-12 md:h-16 w-3/4 mx-auto rounded-lg" />
        <SkeletonBox className="h-12 md:h-16 w-2/3 mx-auto rounded-lg" />
      </div>
      <div className="space-y-3 mb-12 max-w-2xl mx-auto">
        <SkeletonText width="w-5/6" />
        <SkeletonText width="w-4/6" />
      </div>
      <div className="flex justify-center gap-4">
        <SkeletonBox className="h-12 w-32 rounded-full" />
        <SkeletonBox className="h-12 w-32 rounded-full" />
      </div>
    </div>
  </section>
);

const LoadingFeature = ({ index }: { index: number }) => {
  const isEven = index % 2 === 0;
  
  return (
    <section className="relative px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-16`}>
          <div className="flex-shrink-0">
            <SkeletonBox className="w-24 h-24 md:w-32 md:h-32 rounded-2xl" />
          </div>
          <div className="flex-1 space-y-4 w-full">
            <SkeletonBox className="h-8 md:h-10 w-3/4 mx-auto md:mx-0 rounded-lg" />
            <div className="space-y-2">
              <SkeletonText width="w-full" />
              <SkeletonText width="w-5/6" />
            </div>
            <div className="pt-4">
              <SkeletonBox className="h-12 w-32 rounded-lg" />
              <SkeletonBox className="h-3 w-24 mt-2 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LoadingFooter = () => (
  <footer className="relative px-4 py-12 border-t border-slate-600">
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <SkeletonBox className="h-5 w-24" />
            <div className="space-y-2">
              <SkeletonBox className="h-3 w-20" />
              <SkeletonBox className="h-3 w-16" />
              <SkeletonBox className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-8 border-t border-slate-600">
        <SkeletonBox className="h-4 w-48 mx-auto" />
      </div>
    </div>
  </footer>
);

// Optimized Logo Loader
const LogoLoader = ({ onFinish }: { onFinish: () => void }) => {
  const [startReveal, setStartReveal] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartReveal(true);
    }, prefersReducedMotion ? 500 : 1000);
    
    const finishTimer = setTimeout(() => {
      onFinish();
    }, prefersReducedMotion ? 800 : 2200);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <img
          src="/musionic.png"
          alt="Logo"
          className="w-32 h-32 object-contain"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      animate={startReveal ? {
        clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
      } : {}}
      transition={{ 
        duration: 1.2, 
        ease: [0.76, 0, 0.24, 1]
      }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={startReveal ? {
          x: "100vw",
          y: "100vh",
          scale: 0.5,
          opacity: 0
        } : {}}
        transition={{ 
          duration: 1.2, 
          ease: [0.76, 0, 0.24, 1]
        }}
      >
        <motion.img
          src="/musionic.png"
          alt="Logo"
          className="w-32 h-32 object-contain"
          animate={!startReveal ? {
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          } : {}}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: startReveal ? 0 : Infinity,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function WAV0Landing() {
  const [showLogoLoader, setShowLogoLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Check sessionStorage untuk skip loader di visit berikutnya
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited");
    if (hasVisited) {
      setShowLogoLoader(false);
      setShowContent(true);
      // Delay background render
      setTimeout(() => setShowBackground(true), 100);
    } else {
      sessionStorage.setItem("visited", "true");
    }
  }, []);

  useEffect(() => {
    if (!showLogoLoader && !sessionStorage.getItem("visited-loaded")) {
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, prefersReducedMotion ? 300 : 1000);

      const backgroundTimer = setTimeout(() => {
        setShowBackground(true);
      }, prefersReducedMotion ? 500 : 1500);

      return () => {
        clearTimeout(contentTimer);
        clearTimeout(backgroundTimer);
      };
    }
  }, [showLogoLoader, prefersReducedMotion]);

  const handleLogoFinish = () => {
    setShowLogoLoader(false);
    sessionStorage.setItem("visited-loaded", "true");
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showLogoLoader ? (
          <LogoLoader onFinish={handleLogoFinish} />
        ) : (
          <>
            {/* Navbar */}
            <div className="fixed top-0 w-full z-20">
              <Suspense fallback={<LoadingNavbar />}>
                {showContent ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                  >
                    <Navbar />
                  </motion.div>
                ) : (
                  <LoadingNavbar />
                )}
              </Suspense>
            </div>
  
            {/* Content */}
            <div className="min-h-screen bg-background relative pt-16 md:pt-16">
              {showBackground && (
                <Suspense fallback={null}>
                  <DynamicBackground />
                </Suspense>
              )}
              <div className="relative z-10">
                {!showContent ? (
                  <div>
                    <LoadingHero />
                    <main>
                      {[0, 1, 2].map((index) => (
                        <LoadingFeature key={index} index={index} />
                      ))}
                    </main>
                    <LoadingFooter />
                  </div>
                ) : (
                  <Suspense fallback={<LoadingHero />}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                    >
                      <HeroSection />
                      <main>
                        <FeatureSection
                          title="Upload Music Covers"
                          description="Local artists can easily upload covers of their favorite songs. Search tracks, submit your cover, and compare it with the original version in an interactive player."
                          icon={<Music size={40} />}
                          delay={prefersReducedMotion ? 0 : 0.2}
                          index={0}
                          metric="Unlimited"
                          metricLabel="Uploads"
                        />
                        <FeatureSection
                          title="Discover Live Gigs"
                          description="Find live gigs and music sessions near you. Filter by location and favorite genres so you never miss a local performance."
                          icon={<MapPin size={40} />}
                          delay={prefersReducedMotion ? 0 : 0.3}
                          index={1}
                          metric="Nearby"
                          metricLabel="Sessions"
                        />
                        <FeatureSection
                          title="Compare Covers"
                          description="Easily compare your uploaded covers with the original tracks. Get insights and feedback from the music community to improve your skills."
                          icon={<Shuffle size={40} />}
                          delay={prefersReducedMotion ? 0 : 0.4}
                          index={2}
                          metric="Interactive"
                          metricLabel="Player"
                        />
                      </main>
                      <Footer />
                      <ChatPill />
                    </motion.div>
                  </Suspense>
                )}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}