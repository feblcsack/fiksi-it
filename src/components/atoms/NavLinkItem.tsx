import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NavLinkItemProps {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  active?: boolean;
  variant?: "default" | "mobile";
}

export function NavLinkItem({ 
  href, 
  children, 
  icon: Icon, 
  onClick,
  active = false,
  variant = "default"
}: NavLinkItemProps) {
  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`block px-4 py-2.5 rounded-xl transition-all ${
          active 
            ? "text-white bg-white/10" 
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon size={18} />}
          {children}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative px-3 py-1.5 rounded-full text-sm transition-all ${
        active 
          ? "text-white bg-white/10" 
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon size={14} />}
        {children}
      </span>
    </Link>
  );
}