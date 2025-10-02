// src/app/(main)/dashboard/musisi/page.tsx
import { GigForm } from '@/./components/features/GigForm';

export default function MusicianDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Musician Dashboard
        </h1>
        
        {/* Form untuk membuat Gig baru */}
        <div className="flex justify-center">
          <GigForm />
        </div>

        {/* Nanti di sini kita tambahkan daftar Gig yang sudah dibuat */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800">My Gigs</h2>
          {/* List of created gigs will go here */}
          <p className="text-gray-500 mt-2">Your created gigs will be listed here.</p>
        </div>
      </div>
    </div>
  );
}