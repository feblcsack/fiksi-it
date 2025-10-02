// components/FollowButton.tsx
"use client";

import { useEffect, useState } from "react";
import {
  followMusisi,
  unfollowMusisi,
  isFollowing,
  getFollowerCount,
} from "@/services/followService";
import { useAuth } from "@/contexts/AuthContext";

interface FollowButtonProps {
  musisiId: string;
}

export default function FollowButton({ musisiId }: FollowButtonProps) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFollowStatus = async () => {
    if (!user) return;

    try {
      const [isFollowingStatus, count] = await Promise.all([
        isFollowing(user.uid, musisiId),
        getFollowerCount(musisiId),
      ]);
      setFollowing(isFollowingStatus);
      setFollowerCount(count);
    } catch (err: any) {
      console.error("Error loading follow status:", err);
    }
  };

  useEffect(() => {
    loadFollowStatus();
  }, [user, musisiId]);

  const handleFollowToggle = async () => {
    if (!user) {
      setError("Login untuk follow musisi");
      return;
    }

    if (user.role === "musisi" && user.uid === musisiId) {
      setError("Tidak bisa follow diri sendiri");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (following) {
        await unfollowMusisi(user.uid, musisiId);
        setFollowing(false);
        setFollowerCount((prev) => prev - 1);
      } else {
        await followMusisi(user.uid, musisiId);
        setFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengubah status follow");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role === "musisi") {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          👥 {followerCount} follower{followerCount !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      <button
        onClick={handleFollowToggle}
        disabled={loading}
        className={`px-6 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          following
            ? "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500"
            : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
        }`}
      >
        {loading ? "Loading..." : following ? "✓ Following" : "+ Follow"}
      </button>

      <p className="text-sm text-gray-600 mt-2">
        👥 {followerCount} follower{followerCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
