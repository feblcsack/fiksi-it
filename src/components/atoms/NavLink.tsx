// src/components/atoms/NavLink.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-light tracking-wide transition-colors ${
        isActive ? "text-white" : "text-white/40 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
