"use client";

import { useState, useEffect } from "react";
import { Music, MapPin, Shuffle } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { FeatureSection } from "@/components/feature-section";
import { ChatPill } from "@/components/chat-pill";
import { DynamicBackground } from "@/components/dynamic-background";
import { Footer } from "@/components/footer";
import { Client3DScene } from "@/components/client-3d-scene";
import { Navbar } from "@/components/organisms/Navbar";
import { motion, AnimatePresence } from "framer-motion";

// Reusable Skeleton Components
function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-600 animate-pulse rounded ${className}`} />
  );
}

function SkeletonText({ width = "w-full" }: { width?: string }) {
  return <div className={`h-4 ${width} bg-slate-600 animate-pulse rounded`} />;
}

// Loading States
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
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative px-4 py-20 md:py-32"
  >
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
  </motion.section>
);

const LoadingFeature = ({ index }: { index: number }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative px-4 py-16 md:py-24"
    >
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
    </motion.section>
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

// Loading stages
type LoadingStage = 'navbar' | 'hero' | 'features' | 'footer' | 'complete';

export default function WAV0Landing() {
  const [showLogoLoader, setShowLogoLoader] = useState(true);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('navbar');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!showLogoLoader) {
      const stages: { stage: LoadingStage; delay: number }[] = [
        { stage: 'navbar', delay: 0 },
        { stage: 'hero', delay: 300 },
        { stage: 'features', delay: 600 },
        { stage: 'footer', delay: 900 },
        { stage: 'complete', delay: 1200 },
      ];

      const timers = stages.map(({ stage, delay }) =>
        setTimeout(() => setLoadingStage(stage), delay)
      );

      const contentTimer = setTimeout(() => setShowContent(true), 1300);

      return () => {
        timers.forEach(clearTimeout);
        clearTimeout(contentTimer);
      };
    }
  }, [showLogoLoader]);


  const isStageLoaded = (stage: LoadingStage) => {
    const stageOrder: LoadingStage[] = ['navbar', 'hero', 'features', 'footer', 'complete'];
    const currentIndex = stageOrder.indexOf(loadingStage);
    const targetIndex = stageOrder.indexOf(stage);
    return currentIndex >= targetIndex;
  };

  const LogoLoader = ({ onFinish }: { onFinish: () => void }) => {
    const [startReveal, setStartReveal] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setStartReveal(true);
      }, 1000); // durasi sebelum reveal dimulai
      
      const finishTimer = setTimeout(() => {
        onFinish();
      }, 2200); // 2000ms + 1200ms animasi reveal
      
      return () => {
        clearTimeout(timer);
        clearTimeout(finishTimer);
      };
    }, [onFinish]);
  
    return (
      <motion.div
        className="fixed inset-0 z-[9999] bg-black overflow-hidden"
        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        animate={startReveal ? {
          clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
        } : {}}
        transition={{ 
          duration: 1.2, 
          ease: [0.76, 0, 0.24, 1] // cubic-bezier untuk smooth easing
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
  

  return (
    <>
      <AnimatePresence mode="wait">
        {showLogoLoader ? (
          <LogoLoader onFinish={() => setShowLogoLoader(false)} />
        ) : (
          <>
            {/* Navbar */}
            <div className="fixed top-0 w-full z-20">
              <AnimatePresence mode="wait">
                {!showContent ? (
                  <motion.div
                    key="loading-navbar"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingNavbar />
                  </motion.div>
                ) : (
                  <motion.div
                    key="navbar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Navbar />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
  
            {/* Konten */}
            <div className="min-h-screen bg-background relative pt-16 md:pt-16">
              <DynamicBackground />
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {!showContent ? (
                    <motion.div
                      key="loading-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {isStageLoaded('hero') && <LoadingHero />}
                      {isStageLoaded('features') && (
                        <main>
                          {[0, 1, 2].map((index) => (
                            <LoadingFeature key={index} index={index} />
                          ))}
                        </main>
                      )}
                      {isStageLoaded('footer') && <LoadingFooter />}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="actual-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <HeroSection />
                      <main>
                        <FeatureSection
                          title="Upload Music Covers"
                          description="Local artists can easily upload covers of their favorite songs. Search tracks, submit your cover, and compare it with the original version in an interactive player."
                          icon={<Music size={40} />}
                          delay={0.2}
                          index={0}
                          metric="Unlimited"
                          metricLabel="Uploads"
                        />
                        <FeatureSection
                          title="Discover Live Gigs"
                          description="Find live gigs and music sessions near you. Filter by location and favorite genres so you never miss a local performance."
                          icon={<MapPin size={40} />}
                          delay={0.3}
                          index={1}
                          metric="Nearby"
                          metricLabel="Sessions"
                        />
                        <FeatureSection
                          title="Compare Covers"
                          description="Easily compare your uploaded covers with the original tracks. Get insights and feedback from the music community to improve your skills."
                          icon={<Shuffle size={40} />}
                          delay={0.4}
                          index={2}
                          metric="Interactive"
                          metricLabel="Player"
                        />
                      </main>
                      <Footer />
                      <ChatPill />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
  
}