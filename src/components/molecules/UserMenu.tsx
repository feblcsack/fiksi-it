"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronDown } from "lucide-react";
import { userNavigation } from "@/lib/navigation/config";

interface UserMenuProps {
  photoURL?: string | null;
  displayName?: string;
  email?: string | null;
  onLogout: () => void;
}

export function UserMenu({ photoURL, displayName, email, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName || "User"}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xs text-white font-medium">
            {displayName?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <span className="text-sm text-white/80 hidden lg:inline">{displayName}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-white/60" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 min-w-[200px] backdrop-blur-xl bg-black/90 border border-white/10 rounded-xl shadow-2xl shadow-black/20 overflow-hidden"
          >
            <div className="p-3 border-b border-white/10">
              <p className="text-sm font-medium text-white">{displayName}</p>
              <p className="text-xs text-white/50 mt-0.5">{email}</p>
            </div>
            <div className="py-2">
              {userNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.icon && <item.icon size={16} />}
                  {item.label}
                </a>
              ))}
            </div>
            <div className="p-2 border-t border-white/10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}