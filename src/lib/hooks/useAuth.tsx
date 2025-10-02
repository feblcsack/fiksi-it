// src/lib/hooks/useAuth.tsx
"use client";

import { 
  useState, 
  useEffect, 
  createContext, 
  useContext,
  ReactNode 
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // Impor dari file config
import { useRouter } from 'next/navigation';

// Definisikan tipe untuk context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

// Buat Context
const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  isLoading: true 
});

// Buat Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listener untuk memantau perubahan status autentikasi
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup listener saat komponen unmount
    return () => unsubscribe();
  }, []);

  const value = { user, isLoading };

  // Sediakan context ke komponen anak
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Buat custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};