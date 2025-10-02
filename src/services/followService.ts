// services/followService.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Follow } from "@/types";

export const followMusisi = async (
  userId: string,
  musisiId: string,
): Promise<string> => {
  try {
    // Cek apakah sudah follow
    const existingFollow = await isFollowing(userId, musisiId);
    if (existingFollow) {
      throw new Error("Already following this musisi");
    }

    const followData = {
      userId,
      musisiId,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "follows"), followData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const unfollowMusisi = async (
  userId: string,
  musisiId: string,
): Promise<void> => {
  try {
    const q = query(
      collection(db, "follows"),
      where("userId", "==", userId),
      where("musisiId", "==", musisiId),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Not following this musisi");
    }

    // Hapus follow
    await deleteDoc(doc(db, "follows", querySnapshot.docs[0].id));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const isFollowing = async (
  userId: string,
  musisiId: string,
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, "follows"),
      where("userId", "==", userId),
      where("musisiId", "==", musisiId),
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error: any) {
    return false;
  }
};

export const getFollowerCount = async (musisiId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, "follows"),
      where("musisiId", "==", musisiId),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.size;
  } catch (error: any) {
    return 0;
  }
};

export const getFollowingList = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(db, "follows"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data().musisiId);
  } catch (error: any) {
    return [];
  }
};
