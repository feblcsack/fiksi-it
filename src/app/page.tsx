"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { Music, MapPin, Shuffle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Preload critical components immediately
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

// Ultra-minimal skeleton
function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`bg-slate-700/50 animate-pulse rounded ${className}`} />;
}

const LoadingNavbar = () => (
  <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
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

// Optimized Logo Loader - lebih cepat
const LogoLoader = ({ onFinish }: { onFinish: () => void }) => {
  const [startReveal, setStartReveal] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Lebih cepat - max 2 detik total
    const forceFinishTimer = setTimeout(() => {
      onFinish();
    }, 2000);

    const timer = setTimeout(() => {
      setStartReveal(true);
    }, prefersReducedMotion ? 200 : 600);
    
    const finishTimer = setTimeout(() => {
      onFinish();
    }, prefersReducedMotion ? 400 : 1400);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
      clearTimeout(forceFinishTimer);
    };
  }, [onFinish, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <img
          src="/musionic.png"
          alt="Logo"
          className="w-24 h-24 object-contain"
          onError={() => onFinish()}
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
        duration: 0.8, 
        ease: [0.76, 0, 0.24, 1]
      }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={startReveal ? {
          x: "100vw",
          y: "100vh",
          scale: 0.3,
          opacity: 0
        } : {}}
        transition={{ 
          duration: 0.8, 
          ease: [0.76, 0, 0.24, 1]
        }}
      >
        <motion.img
          src="/musionic.png"
          alt="Logo"
          className="w-24 h-24 object-contain"
          onError={() => onFinish()}
          animate={!startReveal ? {
            rotate: [0, 360],
            scale: [1, 1.08, 1],
          } : {}}
          transition={{
            duration: 0.7,
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
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Check visit history
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited");
    if (hasVisited) {
      setShowLogoLoader(false);
      setIsReady(true);
    } else {
      sessionStorage.setItem("visited", "true");
    }
  }, []);

  const handleLogoFinish = () => {
    setShowLogoLoader(false);
    // Immediate render after logo
    requestAnimationFrame(() => {
      setIsReady(true);
    });
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
                <Navbar />
              </Suspense>
            </div>
  
            {/* Main Content */}
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative pt-16">
              {/* Background - load in background, no blocking */}
              {isReady && (
                <Suspense fallback={null}>
                  <DynamicBackground />
                </Suspense>
              )}
              
              <div className="relative z-10">
                {/* Hero - load immediately */}
                <Suspense fallback={
                  <div className="h-screen flex items-center justify-center">
                    <div className="w-48 space-y-3">
                      <SkeletonBox className="h-4 w-full" />
                      <SkeletonBox className="h-4 w-3/4" />
                    </div>
                  </div>
                }>
                  {isReady && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    >
                      <HeroSection />
                    </motion.div>
                  )}
                </Suspense>

                {/* Features - load immediately after hero */}
                {isReady && (
                  <Suspense fallback={null}>
                    <main>
                      <FeatureSection
                        title="Upload Music Covers"
                        description="Local artists can easily upload covers of their favorite songs. Search tracks, submit your cover, and compare it with the original version in an interactive player."
                        icon={<Music size={40} />}
                        delay={0}
                        index={0}
                        metric="Unlimited"
                        metricLabel="Uploads"
                      />
                      <FeatureSection
                        title="Discover Live Gigs"
                        description="Find live gigs and music sessions near you. Filter by location and favorite genres so you never miss a local performance."
                        icon={<MapPin size={40} />}
                        delay={0}
                        index={1}
                        metric="Nearby"
                        metricLabel="Sessions"
                      />
                      <FeatureSection
                        title="Compare Covers"
                        description="Easily compare your uploaded covers with the original tracks. Get insights and feedback from the music community to improve your skills."
                        icon={<Shuffle size={40} />}
                        delay={0}
                        index={2}
                        metric="Interactive"
                        metricLabel="Player"
                      />
                    </main>
                  </Suspense>
                )}

                {/* Footer - load last */}
                {isReady && (
                  <Suspense fallback={null}>
                    <Footer />
                    <ChatPill />
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