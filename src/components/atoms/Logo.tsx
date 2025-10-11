import Link from "next/link";
import { motion } from "framer-motion";
// import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2">
      {/* <motion.div
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5 }}
        className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center shadow-sm"
      >
        <Sparkles size={18} className="text-slate-200" />
      </motion.div> */}
      <span className="font-sm text-xl text-red-100 font-lora">Musnic</span>
    </Link>
  );
}