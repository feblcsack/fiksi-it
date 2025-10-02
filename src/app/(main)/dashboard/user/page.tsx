import { Navbar } from "../../../../components/organisms/Navbar";
import { NearbyGigsList } from "@/components/features/NearbyGigsList";

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
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
