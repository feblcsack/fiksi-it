"use client";

import { useState, useEffect, FormEvent, Fragment } from "react";
import { db } from "@/lib/firebase/config";
import { uploadFile } from "@/lib/firebase/storage";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";

interface Song {
  id: string;
  title: string;
  artist: string;
}

interface AddCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCoverModal({ isOpen, onClose }: AddCoverModalProps) {
  const [originalSongs, setOriginalSongs] = useState<Song[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<string>("");
  const [coverArtist, setCoverArtist] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mengambil daftar lagu original dari Firestore
  useEffect(() => {
    const q = query(collection(db, "songs"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Song[];
      setOriginalSongs(songsData);
      if (songsData.length > 0 && !selectedSongId) {
        setSelectedSongId(songsData[0].id);
      }
    });
    return () => unsubscribe();
  }, [selectedSongId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSongId || !coverArtist || !audioFile) {
      setError("Semua field harus diisi.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload file audio ke Firebase Storage
      const audioUrl = await uploadFile(audioFile, "covers");

      // 2. Dapatkan detail lagu original
      const songDocRef = doc(db, "songs", selectedSongId);
      const songDoc = await getDoc(songDocRef);
      if (!songDoc.exists()) throw new Error("Lagu original tidak ditemukan");
      const songData = songDoc.data();

      // 3. Simpan data cover ke Firestore
      await addDoc(collection(db, "covers"), {
        coverArtist,
        audioUrl,
        originalSongId: selectedSongId,
        originalTitle: songData.title,
        originalArtist: songData.artist,
        spotifyTrackId: songData.spotifyTrackId,
        createdAt: serverTimestamp(),
      });

      // 4. Reset form dan tutup modal
      setCoverArtist("");
      setAudioFile(null);
      setSelectedSongId(originalSongs.length > 0 ? originalSongs[0].id : "");
      onClose();
    } catch (err) {
      console.error("Gagal menambahkan cover:", err);
      setError("Gagal menambahkan cover. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-700 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Add New Cover
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Form fields */}
                  <div>
                    <label
                      htmlFor="coverArtist"
                      className="block text-sm font-medium text-neutral-400"
                    >
                      Cover Artist Name
                    </label>
                    <input
                      type="text"
                      id="coverArtist"
                      value={coverArtist}
                      onChange={(e) => setCoverArtist(e.target.value)}
                      className="mt-1 block w-full bg-neutral-800 border-neutral-600 rounded-md shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="originalSong"
                      className="block text-sm font-medium text-neutral-400"
                    >
                      Original Song
                    </label>
                    <select
                      id="originalSong"
                      value={selectedSongId}
                      onChange={(e) => setSelectedSongId(e.target.value)}
                      className="mt-1 block w-full bg-neutral-800 border-neutral-600 rounded-md shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    >
                      {originalSongs.map((song) => (
                        <option key={song.id} value={song.id}>
                          {song.title} - {song.artist}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="audioFile"
                      className="block text-sm font-medium text-neutral-400"
                    >
                      Audio File (MP3)
                    </label>
                    <input
                      type="file"
                      id="audioFile"
                      accept="audio/mpeg"
                      onChange={(e) =>
                        setAudioFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="mt-1 block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-transparent bg-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-600 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
                    >
                      {isSubmitting ? "Uploading..." : "Add Cover"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
