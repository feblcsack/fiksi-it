// services/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, UserRole } from "@/types";

export const signUp = async (
  email: string,
  password: string,
  role: UserRole,
  displayName?: string,
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const firebaseUser = userCredential.user;

    // Simpan data user ke Firestore
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      role,
      displayName: displayName || email.split("@")[0],
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userData);

    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signIn = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const firebaseUser = userCredential.user;

    // Ambil data user dari Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    return userDoc.data() as User;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async (
  firebaseUser: FirebaseUser,
): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as User;
  } catch (error) {
    return null;
  }
};
