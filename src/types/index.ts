// types/index.ts

export type UserRole = "musisi" | "user";

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Gig {
  id: string;
  musisiId: string;
  musisiName: string;
  namaAcara: string;
  deskripsi: string;
  lokasi: {
    alamat: string;
    latitude: number;
    longitude: number;
  };
  jamMulai: Date;
  coverImage?: string;
  coverVideo?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  gigId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface Follow {
  id: string;
  userId: string; // yang follow
  musisiId: string; // yang di-follow
  createdAt: Date;
}

export interface MapFilters {
  radius: 1 | 5 | 10; // dalam km
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}
