"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData, GeoPoint } from "firebase/firestore";
import { getDistanceFromLatLonInKm } from "@/lib/utils";
import { MapPin, Calendar } from "lucide-react";

interface GigData {
  id: string;
  title: string;
  location: GeoPoint;
  datetime: Date;
  distance?: number;
}

export const NearbyGigsList = () => {
  const [gigs, setGigs] = useState<GigData[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          setError("Location access denied. Please enable it to see nearby gigs.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
    }
  }, []);

  // Fetch gigs
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gigs"));
        const gigsData = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
          datetime: doc.data().datetime.toDate(),
        })) as GigData[];
        setGigs(gigsData);
      } catch (err) {
        setError("Failed to fetch gigs.");
      } finally {
        if (!userLocation) setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  // Filter gigs by distance
  const filteredAndSortedGigs = useMemo(() => {
    if (!userLocation) return [];
    setLoading(false);
    return gigs
      .map((gig) => ({
        ...gig,
        distance: getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lon,
          gig.location.latitude,
          gig.location.longitude
        ),
      }))
      .filter((gig) => gig.distance !== undefined && gig.distance <= radius)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [gigs, userLocation, radius]);

  if (loading) return <p className="text-center text-gray-400">Finding gigs near you...</p>;
  if (error) return <p className="text-center text-red-400">{error}</p>;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Radius Filter */}
      <div className="flex justify-end mb-8">
        <select
          id="radius"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="bg-[#161b22] border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
        >
          <option value={1}>1 km</option>
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={25}>25 km</option>
          <option value={100}>100 km</option>
        </select>
      </div>

      {/* Gigs List */}
      <div className="space-y-4">
        {filteredAndSortedGigs.length > 0 ? (
          filteredAndSortedGigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-[#161b22] border border-white/10 rounded-xl p-5 hover:border-white/20 hover:bg-white/5 transition-colors"
            >
              <h3 className="text-xl font-light text-white">{gig.title}</h3>
              <div className="flex items-center text-sm text-gray-400 mt-2">
                <Calendar className="w-4 h-4 mr-2" />
                {gig.datetime.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <MapPin className="w-4 h-4 mr-2" />
                {gig.distance?.toFixed(1)} km away
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-[#161b22] border border-white/10 rounded-xl">
            <h3 className="text-lg font-light text-white">No gigs nearby</h3>
            <p className="text-gray-400 mt-2 text-sm">
              Try increasing the search radius or check again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
