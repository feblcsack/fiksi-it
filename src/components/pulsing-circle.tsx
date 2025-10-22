"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PulsingBorder } from "@paper-design/shaders-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PulsingCircle() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleCircleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleForumRedirect = () => {
    router.push("/forum");
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
  {/* Floating Helper Bubble */}
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-transparent backdrop-blur-xl text-gray-100 shadow-lg rounded-2xl p-4 w-64 border border-white/20"
      >
        <p className="text-sm font-medium mb-3 leading-relaxed">
          Hey! 👋 Mau ngobrol bareng fans Hivi, Reality Club, dan lainnya?
        </p>
        <button
          onClick={handleForumRedirect}
          className="w-full px-3 py-2 border border-white/30 text-white text-sm rounded-lg backdrop-blur-md hover:border-white/60 hover:bg-white/10 transition-all duration-300"
        >
          Masuk ke Fan Community 💬
        </button>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Main Pulsing Circle */}
  <motion.div
    onClick={handleCircleClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="relative w-20 h-20 flex items-center justify-center cursor-pointer"
  >
    {/* Elegan Pulsing Border */}
    <PulsingBorder
      colors={["#B0E8FF", "#DDAAFF", "#FF99CC"]}
      colorBack="#00000000"
      speed={1.2}
      roundness={1}
      thickness={0.12}
      softness={0.3}
      intensity={4}
      spotSize={0.08}
      pulse={0.15}
      smoke={0.5}
      smokeSize={4}
      scale={0.7}
      rotation={0}
      style={{
        width: "65px",
        height: "65px",
        borderRadius: "50%",
      }}
    />

    {/* Rotating subtle text */}
    <motion.svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      animate={{ rotate: 360 }}
      transition={{
        duration: 25,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      style={{ transform: "scale(1.4)" }}
    >
      <defs>
        <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
      </defs>
      <text className="text-[10px] fill-white/70 tracking-wider">
        <textPath href="#circle" startOffset="0%">
          {"fan community . connect . share . vibe . "}
        </textPath>
      </text>
    </motion.svg>

    {/* Center Icon */}
    <motion.div
      className="absolute text-white text-2xl"
      animate={{ rotate: isOpen ? 45 : 0 }}
      transition={{ duration: 0.3 }}
    >
      💬
    </motion.div>
  </motion.div>
</div>

  );
}
