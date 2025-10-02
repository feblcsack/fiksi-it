// services/reviewService.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Review } from "@/types";

export const addReview = async (
  reviewData: Omit<Review, "id" | "createdAt">,
): Promise<string> => {
  try {
    const reviewToSave = {
      ...reviewData,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "reviews"), reviewToSave);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getReviewsByGig = async (gigId: string): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("gigId", "==", gigId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Review[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getReviewsByMusisi = async (
  musisiId: string,
): Promise<Review[]> => {
  try {
    // Pertama, ambil semua gigs dari musisi ini
    const gigsQuery = query(
      collection(db, "gigs"),
      where("musisiId", "==", musisiId),
    );
    const gigsSnapshot = await getDocs(gigsQuery);
    const gigIds = gigsSnapshot.docs.map((doc) => doc.id);

    if (gigIds.length === 0) {
      return [];
    }

    // Kemudian ambil semua reviews untuk gigs tersebut
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("gigId", "in", gigIds),
      orderBy("createdAt", "desc"),
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);

    return reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Review[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAverageRating = async (gigId: string): Promise<number> => {
  try {
    const reviews = await getReviewsByGig(gigId);

    if (reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  } catch (error: any) {
    return 0;
  }
};
