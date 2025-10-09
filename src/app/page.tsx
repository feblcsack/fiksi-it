"use client";

import { useState, useEffect } from "react";
import { Sliders, Archive, FileText } from "lucide-react";
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
  <div className="bg-white/80 backdrop-blur-sm border-b border-slate-600/50">
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
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('navbar');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Progressive loading stages
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

    // Show content after all loading stages
    const contentTimer = setTimeout(() => setShowContent(true), 1300);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(contentTimer);
    };
  }, []);

  const isStageLoaded = (stage: LoadingStage) => {
    const stageOrder: LoadingStage[] = ['navbar', 'hero', 'features', 'footer', 'complete'];
    const currentIndex = stageOrder.indexOf(loadingStage);
    const targetIndex = stageOrder.indexOf(stage);
    return currentIndex >= targetIndex;
  };

  return (
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

      <div className="min-h-screen bg-background relative pt-16 md:pt-16">
        {/* Optional backgrounds */}
        <div className="hidden">
          <DynamicBackground />
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {!showContent ? (
              <motion.div
                key="loading-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Loading Hero */}
                {isStageLoaded('hero') && <LoadingHero />}

                {/* Loading Features */}
                {isStageLoaded('features') && (
                  <main>
                    {[0, 1, 2].map((index) => (
                      <LoadingFeature key={index} index={index} />
                    ))}
                  </main>
                )}

                {/* Loading Footer */}
                {isStageLoaded('footer') && <LoadingFooter />}
              </motion.div>
            ) : (
              <motion.div
                key="actual-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Actual Hero */}
                <HeroSection />

                {/* Actual Features */}
                <main>
                  <FeatureSection
                    title="Music cover"
                    description="Browser-native DAW with zero downloads. Edit, create soundpacks, export to any format. Faster than stock sites."
                    icon={<Sliders size={40} />}
                    delay={0.2}
                    index={0}
                    metric="Zero"
                    metricLabel="Friction Export"
                  />
                  <FeatureSection
                    title="Near live gigs"
                    description="Secure flexible storage for your music. Easily store and have control over who has access to your music. Private by default."
                    icon={<Archive size={40} />}
                    delay={0.3}
                    index={1}
                    metric="Private"
                    metricLabel="By Default"
                  />
                  <FeatureSection
                    title="Version Control"
                    description="Easily toggle between versions of your audio files in Vault and generations in WAV0 Agent."
                    icon={<FileText size={40} />}
                    delay={0.4}
                    index={2}
                    metric="1-Click"
                    metricLabel="Rollback"
                  />
                </main>

                {/* Actual Footer */}
                <Footer />

                {/* Chat Pill */}
                <ChatPill />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}