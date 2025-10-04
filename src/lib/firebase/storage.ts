// src/lib/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The path to upload the file to (e.g., 'covers').
 * @returns A promise that resolves with the download URL.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Membuat referensi unik untuk file
  const fileRef = ref(storage, `${path}/${Date.now()}-${file.name}`);

  // Upload file
  const snapshot = await uploadBytes(fileRef, file);

  // Dapatkan URL download
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};
