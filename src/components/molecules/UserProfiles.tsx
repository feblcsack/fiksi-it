"use client";

import { Avatar } from "../atoms/Avatar";
import Link from "next/link";

interface UserProfileProps {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
}

export function UserProfile({
  photoURL,
  displayName,
  email,
}: UserProfileProps) {
  const fallback = (displayName || email || "U")[0].toUpperCase();
  const name = displayName || email?.split("@")[0] || "User";

  return (
    <Link
      href="/profile"
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      <Avatar src={photoURL} alt={name} fallback={fallback} />
      <span className="text-sm font-light text-white hidden md:block">
        {name}
      </span>
    </Link>
  );
}
