import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NavButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "default" | "primary" | "ghost";
  icon?: LucideIcon;
  className?: string;
}

export function NavButton({ 
  onClick, 
  children, 
  variant = "default",
  icon: Icon,
  className = ""
}: NavButtonProps) {
  const variants = {
    default: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/80 hover:text-white",
    primary: "bg-slate-800 hover:bg-slate-700 border-0 text-white shadow-sm",
    ghost: "bg-transparent hover:bg-white/5 border-0 text-white/70 hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
}