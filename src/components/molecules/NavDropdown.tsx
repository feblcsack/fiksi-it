"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NavLink } from "@/lib/navigation/config";

interface NavDropdownProps {
  label: string;
  items: NavLink[];
  icon?: any;
}

export function NavDropdown({ label, items, icon: Icon }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1 ${
          isOpen 
            ? "text-white bg-white/10" 
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {Icon && <Icon size={14} />}
        {label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 min-w-[180px] backdrop-blur-xl bg-black/90 border border-white/10 rounded-xl shadow-2xl shadow-black/20 overflow-hidden"
          >
            <div className="py-2">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  <span className="flex items-center gap-2">
                    {item.icon && <item.icon size={16} />}
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}