"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { NavLinks } from "../molecules/NavLinks";
import { UserProfile } from "../molecules/UserProfiles";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
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
      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="h-6 w-24 bg-white/5 animate-pulse" />
          <div className="h-8 w-32 bg-white/5 animate-pulse rounded-full" />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-white/10 bg-black sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link
          href="/dashboard/homeMuc"
          className="font-serif text-xl tracking-tight text-white"
        >
          GigsFind
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
          {userData ? (
            <div className="flex items-center gap-4">
              <UserProfile
                photoURL={userData.photoURL}
                displayName={userData.displayName}
                email={userData.email}
              />
              <button
                onClick={handleLogout}
                className="text-sm text-white/60 hover:text-white flex items-center gap-1 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-md shadow-lg"
          >
            <nav className="flex flex-col p-4 space-y-4">
              <Link
                href="/dashboard/homeMuc"
                className="text-white/80 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/dashboard/musisi"
                className="text-white/80 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Gigs
              </Link>
              <Link
                href="/pricing"
                className="text-white/80 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Pricing
              </Link>

              {userData ? (
                <>
                  <Link
                    href="/profile"
                    className="text-white/80 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </motion.button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-white/80 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
