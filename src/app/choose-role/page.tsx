"use client";

import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { Music, User as UserIcon } from "lucide-react";

export default function ChooseRolePage() {
  const router = useRouter();

  const handleChooseRole = async (role: "user" | "musisi") => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), { role });

    router.push(role === "musisi" ? "/dashboard/musisi" : "/dashboard/user");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl mb-6">Pilih Role Kamu</h1>
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => handleChooseRole("user")}
          className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-lg"
        >
          <UserIcon className="mx-auto mb-2" /> User
        </button>
        <button
          onClick={() => handleChooseRole("musisi")}
          className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-lg"
        >
          <Music className="mx-auto mb-2" /> Musisi
        </button>
      </div>
    </div>
  );
}
