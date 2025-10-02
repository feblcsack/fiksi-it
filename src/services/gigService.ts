// services/gigService.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Gig } from "@/types";

export const createGig = async (
  gigData: Omit<Gig, "id" | "createdAt">,
  coverFile?: File,
): Promise<string> => {
  try {
    let coverImageUrl = "";

    // Upload cover image jika ada
    if (coverFile) {
      const storageRef = ref(storage, `gigs/${Date.now()}_${coverFile.name}`);
      await uploadBytes(storageRef, coverFile);
      coverImageUrl = await getDownloadURL(storageRef);
    }

    const gigToSave = {
      ...gigData,
      coverImage: coverImageUrl,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "gigs"), gigToSave);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getGigsByMusisi = async (musisiId: string): Promise<Gig[]> => {
  try {
    const q = query(collection(db, "gigs"), where("musisiId", "==", musisiId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      jamMulai: doc.data().jamMulai.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Gig[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllGigs = async (): Promise<Gig[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "gigs"));

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      jamMulai: doc.data().jamMulai.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Gig[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getGigById = async (gigId: string): Promise<Gig | null> => {
  try {
    const docRef = doc(db, "gigs", gigId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      jamMulai: docSnap.data().jamMulai.toDate(),
      createdAt: docSnap.data().createdAt.toDate(),
    } as Gig;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Fungsi helper untuk menghitung jarak antara 2 koordinat (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Jarak dalam km
};

export const getGigsWithinRadius = async (
  userLat: number,
  userLon: number,
  radiusKm: number,
): Promise<Gig[]> => {
  try {
    const allGigs = await getAllGigs();

    return allGigs.filter((gig) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        gig.lokasi.latitude,
        gig.lokasi.longitude,
      );
      return distance <= radiusKm;
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
