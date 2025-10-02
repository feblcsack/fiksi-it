// src/app/(auth)/auth/page.tsx
"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Music, User as UserIcon } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


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
          name: email.split('@')[0],
        });

        // Arahkan sesuai peran
        router.push(role === 'musisi' ? '/dashboard/musisi' : '/dashboard/user');

      } else {
        // Logika Login
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard/user');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Simpan data user di Firestore kalau baru pertama kali login
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: "user", // default user (lo bisa ubah jadi musisi kalau perlu)
      },
      { merge: true } // biar gak overwrite kalau udah ada
    );

    // Arahkan ke dashboard sesuai role
    router.push("/dashboard/user");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light tracking-tight mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-white/40 text-sm font-light">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-px mb-8 border border-white/10">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-medium tracking-wide transition-colors ${
              mode === 'login' 
                ? 'bg-white text-black' 
                : 'bg-transparent text-white/40 hover:text-white'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-sm font-medium tracking-wide transition-colors ${
              mode === 'register' 
                ? 'bg-white text-black' 
                : 'bg-transparent text-white/40 hover:text-white'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Role Selection (Register only) */}
        {mode === 'register' && (
          <div className="mb-8">
            <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-4">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-px border border-white/10">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex flex-col items-center justify-center py-8 transition-colors ${
                  role === 'user'
                    ? 'bg-white/10'
                    : 'bg-transparent hover:bg-white/5'
                }`}
              >
                <UserIcon 
                  className={`h-8 w-8 mb-3 ${
                    role === 'user' ? 'text-white' : 'text-white/30'
                  }`} 
                />
                <span className={`text-sm font-light ${
                  role === 'user' ? 'text-white' : 'text-white/40'
                }`}>
                  User
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole('musisi')}
                className={`flex flex-col items-center justify-center py-8 transition-colors ${
                  role === 'musisi'
                    ? 'bg-white/10'
                    : 'bg-transparent hover:bg-white/5'
                }`}
              >
                <Music 
                  className={`h-8 w-8 mb-3 ${
                    role === 'musisi' ? 'text-white' : 'text-white/30'
                  }`} 
                />
                <span className={`text-sm font-light ${
                  role === 'musisi' ? 'text-white' : 'text-white/40'
                }`}>
                  Musician
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors font-light"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors font-light"
              placeholder="••••••••"
            />
          </div>

          <div className="mt-6">
  <button
    type="button"
    onClick={handleGoogleLogin}
    disabled={isLoading}
    className="w-full flex items-center justify-center gap-3 border border-white/20 py-3 text-sm font-medium tracking-wide hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="h-5 w-5" />
    Continue with Google
  </button>
</div>


          {error && (
            <div className="border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400 font-light">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-3 text-sm font-medium tracking-wide hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'PROCESSING...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/20 font-light">
            By continuing, you agree to our terms
          </p>
        </div>
      </div>
    </div>
  );
}