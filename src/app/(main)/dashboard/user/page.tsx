import { Navbar } from "../../../../components/organisms/Navbar";
import { NearbyGigsList } from "@/components/features/NearbyGigsList";

export default function UserDashboardPage() {
  return (
    <>
      <Navbar />

<div>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h2 className="text-5xl font-light tracking-tight mb-4 font-lora">
            Live Near You
          </h2>
          <p className="text-white/40 text-lg font-light max-w-2xl">
            Discover live music performances happening around your area
          </p>
        </div>
        <div>
          <NearbyGigsList />
        </div>
      </div>
    </div>
    </>
  );
}
