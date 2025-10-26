"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase/config"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { NavLinks } from "../molecules/NavLinks"
import { UserProfile } from "../molecules/UserProfiles"
import Link from "next/link"
import { Menu, X, LogOut, ChevronDown, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { mainNavigation } from "@/lib/navigation/config"

interface UserData {
  username?: string
  displayName?: string
  photoURL?: string | null
  email?: string | null
}

function MobileDropdown({ item, setMenuOpen }: any) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full justify-between items-center px-4 py-3 rounded-lg text-retro-dark/70 hover:text-retro-dark hover:bg-retro-cream/20 transition-all font-serif"
      >
        <span className="font-medium">{item.label}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 mt-1 space-y-1 border-l-2 border-retro-sage/40 pl-3"
          >
            {item.items.map((subItem: any) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className="block px-3 py-2.5 rounded-lg text-sm text-retro-dark/60 hover:text-retro-dark hover:bg-retro-cream/20 transition-all font-serif"
                onClick={() => setMenuOpen(false)}
              >
                {subItem.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          const firestoreData = userDoc.exists() ? userDoc.data() : {}

          setUserData({
            username: firestoreData.username,
            displayName: user.displayName || firestoreData.username,
            photoURL: user.photoURL,
            email: user.email,
          })
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUserData({
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          })
        }
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [menuOpen])

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="bg-retro-cream/80 backdrop-blur-md rounded-2xl border-2 border-retro-dark/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-28 bg-retro-dark/10 animate-pulse rounded-lg" />
              <div className="h-9 w-36 bg-retro-dark/10 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-7xl px-4 sm:px-6 py-4"
        >
          <nav
            className={`relative backdrop-blur-md rounded-3xl border-2 transition-all duration-300 ${
              scrolled
                ? "bg-retro-cream/90 border-retro-dark/30 shadow-lg shadow-retro-dark/10"
                : "bg-retro-cream/80 border-retro-dark/20"
            }`}
          >
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
              {/* Logo with retro styling */}
              <Link href="/dashboard/homeMuc" className="group flex items-center gap-2">
                <span className="font-bold text-2xl text-retro-dark font-serif tracking-wide">Musionic</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-retro-sage/20 border border-retro-sage/40">
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
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-retro-sage/30 border-2 border-retro-sage/60 hover:bg-retro-sage/40 hover:border-retro-sage/80 transition-all text-sm text-retro-dark font-serif"
                    >
                      <LogOut size={16} />
                      <span className="hidden lg:inline">Logout</span>
                    </motion.button>
                  </div>
                ) : (
                  <Link
                    href="/auth?mode=login"
                    className="ml-2 px-5 py-2 rounded-full bg-retro-sage/50 hover:bg-retro-sage/70 transition-colors text-sm font-serif font-medium text-retro-dark border-2 border-retro-sage/60 shadow-md"
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Hamburger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(true)}
                className="md:hidden p-2 rounded-xl bg-retro-sage/30 border-2 border-retro-sage/60 hover:bg-retro-sage/40 transition-colors"
              >
                <Menu size={20} className="text-retro-dark" />
              </motion.button>
            </div>
          </nav>
        </motion.div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Sidebar with retro aesthetic */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-retro-cream to-retro-cream/95 border-l-4 border-retro-sage z-[70] md:hidden shadow-2xl shadow-retro-dark/20 overflow-y-auto"
            >
              {/* Sidebar Header */}
              <div className="sticky top-0 bg-retro-cream/98 backdrop-blur-md border-b-2 border-retro-sage/40 px-6 py-5 flex items-center justify-between z-10">
                <span className="font-bold text-2xl text-retro-dark font-serif tracking-wide">Musionic</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl bg-retro-sage/30 border-2 border-retro-sage/60 hover:bg-retro-sage/40 transition-colors"
                >
                  <X size={20} className="text-retro-dark" />
                </motion.button>
              </div>

              {/* User Profile Section */}
              {userData && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="px-6 py-5 border-b-2 border-retro-sage/30"
                >
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-retro-sage/20 border-2 border-retro-sage/40">
                    {userData.photoURL ? (
                      <img
                        src={userData.photoURL || "/placeholder.svg"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-retro-sage/60"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-retro-sage/40 flex items-center justify-center border-2 border-retro-sage/60">
                        <User size={24} className="text-retro-dark" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-retro-dark font-serif truncate">
                        {userData.displayName || "User"}
                      </p>
                      <p className="text-xs text-retro-dark/60 truncate font-serif">{userData.email}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Links */}
              <nav className="px-6 py-5 space-y-2">
                {mainNavigation.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {"items" in item ? (
                      <MobileDropdown item={item} setMenuOpen={setMenuOpen} />
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-4 py-3 rounded-xl text-retro-dark/70 hover:text-retro-dark hover:bg-retro-sage/20 transition-all font-serif font-medium border-l-4 border-transparent hover:border-retro-sage"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}

                {/* Divider */}
                <div className="py-3">
                  <div className="border-t-2 border-retro-sage/30" />
                </div>

                {/* User Actions */}
                {userData ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-3 rounded-xl text-retro-dark/70 hover:text-retro-dark hover:bg-retro-sage/20 transition-all font-serif font-medium border-l-4 border-transparent hover:border-retro-sage"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <button
                        onClick={() => {
                          setMenuOpen(false)
                          handleLogout()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-retro-warm/70 hover:text-retro-warm hover:bg-retro-warm/10 transition-all font-serif font-medium border-l-4 border-transparent hover:border-retro-warm"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/auth?mode=login"
                      className="block px-4 py-3 rounded-xl bg-retro-sage/50 hover:bg-retro-sage/70 text-retro-dark text-center font-serif font-semibold transition-colors shadow-md border-2 border-retro-sage/60"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>
                )}
              </nav>

              {/* Footer */}
              {/* <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t-2 border-retro-sage/30 bg-gradient-to-t from-retro-cream/80 to-transparent">
                <p className="text-xs text-retro-dark/50 text-center font-serif">
                  © 2025 Musionic. All rights reserved.
                </p>
              </div> */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
