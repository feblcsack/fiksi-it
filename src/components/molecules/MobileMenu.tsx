"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { NavLinkItem } from "../atoms/NavLinkItem";
import { usePathname } from "next/navigation";
import { mobileNavigation, isDropdown } from "@/lib/navigation/config";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function MobileMenu({ isOpen, onClose, isAuthenticated, onLogout }: MobileMenuProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden border-t border-white/10"
        >
          <nav className="px-4 py-4 space-y-1">
            {mobileNavigation.map((item, index) => {
              if (isDropdown(item)) {
                const isDropdownOpen = openDropdown === item.label;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <span className="flex items-center gap-3">
                        {item.icon && <item.icon size={18} />}
                        {item.label}
                      </span>
                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={onClose}
                              className="block px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLinkItem
                    href={item.href}
                    icon={item.icon}
                    onClick={onClose}
                    active={pathname === item.href}
                    variant="mobile"
                  >
                    {item.label}
                  </NavLinkItem>
                </motion.div>
              );
            })}

            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mobileNavigation.length * 0.05 }}
              >
                <button
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mobileNavigation.length * 0.05 }}
              >
                <Link
                  href="/auth?mode=login"
                  className="block px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-center font-medium transition-colors"
                  onClick={onClose}
                >
                  Login
                </Link>
              </motion.div>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}