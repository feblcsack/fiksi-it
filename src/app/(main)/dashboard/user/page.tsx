// src/app/(main)/dashboard/user/page.tsx
import { NearbyGigsList } from '@/components/features/NearbyGigsList';

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Nearby Live Gigs
        </h1>
        
        <div className="flex justify-center">
          <NearbyGigsList />
        </div>
      </div>
    </div>
  );
}