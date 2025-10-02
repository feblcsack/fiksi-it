// src/components/features/NearbyGigsList.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData, GeoPoint } from 'firebase/firestore';
import { getDistanceFromLatLonInKm } from '@/lib/utils';
import { MapPin, Calendar } from 'lucide-react';

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
  const [radius, setRadius] = useState(10); // Default radius 10 km
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Minta lokasi user saat komponen dimuat
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
          setError("Location access denied. Please enable it in your browser settings to see nearby gigs.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  // 2. Ambil data semua Gigs dari Firestore
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gigs"));
        const gigsData = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
          datetime: doc.data().datetime.toDate(), // Konversi Timestamp ke Date
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

  // 3. Hitung jarak dan filter gigs saat lokasi user atau data gigs berubah
  const filteredAndSortedGigs = useMemo(() => {
    if (!userLocation) return [];
    
    setLoading(false); // Stop loading once we have the location
    
    return gigs
      .map(gig => ({
        ...gig,
        distance: getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lon,
          gig.location.latitude,
          gig.location.longitude
        ),
      }))
      .filter(gig => gig.distance !== undefined && gig.distance <= radius)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [gigs, userLocation, radius]);

  if (loading) return <p className="text-center text-gray-500">Getting your location and finding gigs...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-4xl">
      {/* Filter Radius */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="radius" className="font-medium">Show gigs within:</label>
          <select 
            id="radius"
            value={radius} 
            onChange={(e) => setRadius(Number(e.target.value))}
            className="border-gray-300 rounded-md shadow-sm"
          >
            <option value={1}>1 km</option>
            <option value={5}>5 km</option>
            <option value="10">10 km</option>
            <option value={25}>25 km</option>
            <option value={100}>100 km</option>
          </select>
        </div>
      </div>

      {/* Daftar Gigs */}
      <div className="space-y-4">
        {filteredAndSortedGigs.length > 0 ? (
          filteredAndSortedGigs.map(gig => (
            <div key={gig.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-indigo-600">{gig.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  {gig.datetime.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center font-semibold text-gray-700">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {gig.distance?.toFixed(1)} km away
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">No Gigs Found</h3>
            <p className="text-gray-500 mt-2">Try increasing the search radius or check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};