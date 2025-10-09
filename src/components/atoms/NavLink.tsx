"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="relative px-4 py-2 rounded-lg group">
      <motion.span
        className={`relative z-10 text-sm font-medium transition-colors ${
          isActive ? "text-white" : "text-white/60 group-hover:text-white"
        }`}
      >
        {children}
      </motion.span>
      
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 bg-white/10 rounded-lg"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}
      
      {!isActive && (
        <motion.div
          className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
}