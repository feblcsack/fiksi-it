"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { NavLinks } from "../molecules/NavLinks";
import { UserProfile } from "../molecules/UserProfiles";
import Link from "next/link";
import { Menu, X, LogOut, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
  username?: string;
  displayName?: string;
  photoURL?: string | null;
  email?: string | null;
}

export function Navbar() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const firestoreData = userDoc.exists() ? userDoc.data() : {};

          setUserData({
            username: firestoreData.username,
            displayName: user.displayName || firestoreData.username,
            photoURL: user.photoURL,
            email: user.email,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData({
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="h-6 w-28 bg-white/10 animate-pulse rounded-lg" />
              <div className="h-9 w-36 bg-white/10 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-4 sm:px-6 py-4"
      >
        <nav
          className={`relative backdrop-blur-xl rounded-2xl border transition-all duration-300 ${
            scrolled
              ? "bg-black/80 border-white/20 shadow-2xl shadow-white/5"
              : "bg-black/60 border-white/10"
          }`}
        >
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Logo with gradient effect */}
            {/* Logo minimalist dark */}
            <Link
              href="/dashboard/homeMuc"
              className="group flex items-center gap-2"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center shadow-sm"
              >
                <Sparkles size={18} className="text-slate-200" />
              </motion.div>
              <span className="font-bold text-xl text-slate-100">Musionic</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5">
                <NavLinks />
              </div>

              {userData ? (
                <div className="flex items-center gap-2 ml-2">
                  <UserProfile
                    photoURL={userData.photoURL}
                    displayName={userData.displayName}
                    email={userData.email}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-white/80 hover:text-white"
                  >
                    <LogOut size={16} />
                    <span className="hidden lg:inline">Logout</span>
                  </motion.button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium text-white shadow-sm"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden border-t border-white/10"
              >
                <nav className="px-4 py-4 space-y-1">
                  {[
                    { href: "/dashboard/homeMuc", label: "Home" },
                    { href: "/dashboard/musisi", label: "Gigs" },
                    { href: "/pricing", label: "Pricing" },
                  ].map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="block px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {userData ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <Link
                          href="/profile"
                          className="block px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                          onClick={() => setMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-red-500/10 transition-all"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Link
                        href="/login"
                        className="block px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-center font-medium transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.div>
    </header>
  );
}
