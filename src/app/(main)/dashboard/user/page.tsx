// src/app/(main)/dashboard/user/page.tsx
import { NearbyGigsList } from '@/components/features/NearbyGigsList';

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-light tracking-tight">DISCOVER</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h2 className="text-5xl font-light tracking-tight mb-4 font-lora">
            Live Near You
          </h2>
          <p className="text-white/40 text-lg font-light max-w-2xl">
            Discover live music performances happening around your area
          </p>
        </div>

        {/* Gigs List */}
        <div>
          <NearbyGigsList />
        </div>
      </div>
    </div>
  );
}