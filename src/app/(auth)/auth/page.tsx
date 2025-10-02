// src/app/(auth)/auth/page.tsx
"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Music, User as UserIcon, LogIn } from 'lucide-react';

type AuthMode = 'login' | 'register';
type UserRole = 'user' | 'musisi';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        // Logika Register
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simpan data peran ke Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          role: role,
          // Tambahkan field lain jika perlu, seperti name
          name: email.split('@')[0], // Contoh nama default
        });

        // Arahkan sesuai peran
        router.push(role === 'musisi' ? '/dashboard/musisi' : '/dashboard/user');

      } else {
        // Logika Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Di aplikasi nyata, kamu perlu fetch data user dari firestore untuk tahu rolenya
        // lalu redirect. Untuk sekarang kita asumsikan redirect ke halaman user.
        // Logika redirect yang lebih baik akan ada di langkah selanjutnya.
        router.push('/dashboard/user');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>

        {/* Toggler Login/Register */}
        <div className="flex justify-center">
          <button
            onClick={() => setMode('login')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Register
          </button>
        </div>

        {/* Pilihan Role (hanya untuk register) */}
        {mode === 'register' && (
          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700 text-center mb-2">I am a...</label>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setRole('user')}
                className={`flex flex-col items-center justify-center w-28 h-24 p-4 border rounded-lg transition-colors ${role === 'user' ? 'bg-indigo-100 border-indigo-500' : 'bg-white'}`}
              >
                <UserIcon className={`h-8 w-8 mb-1 ${role === 'user' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">User</span>
              </button>
              <button
                onClick={() => setRole('musisi')}
                className={`flex flex-col items-center justify-center w-28 h-24 p-4 border rounded-lg transition-colors ${role === 'musisi' ? 'bg-indigo-100 border-indigo-500' : 'bg-white'}`}
              >
                <Music className={`h-8 w-8 mb-1 ${role === 'musisi' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Musician</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Input */}
        <form className="space-y-6" onSubmit={handleAuthAction}>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password"
            />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign in' : 'Create account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}