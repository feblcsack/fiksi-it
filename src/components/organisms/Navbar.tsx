"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { NavLinks } from "../molecules/NavLinks";
import { UserProfile } from "../molecules/UserProfiles";

interface UserData {
  username?: string;
  displayName?: string;
  photoURL?: string | null;
  email?: string | null;
}

export function Navbar() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Ambil data dari Firestore
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
        <div className="font-serif text-xl tracking-tight text-white">
          GigsFind
        </div>

        {/* Navigation Links */}
        <NavLinks />

        {/* User Profile */}
        {userData && (
          <UserProfile
            photoURL={userData.photoURL}
            displayName={userData.displayName}
            email={userData.email}
          />
        )}
      </div>
    </header>
  );
}
