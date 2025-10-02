"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  GeoPoint,
} from "firebase/firestore";
import { getDistanceFromLatLonInKm } from "@/lib/utils";
import { MapPin, Calendar, Info, X, Navigation } from "lucide-react";

interface GigData {
  id: string;
  title: string;
  description?: string;
  location: GeoPoint;
  locationName?: string;
  datetime: Date;
  distance?: number;
  musisiId: string;
}

export const NearbyGigsList = () => {
  const [gigs, setGigs] = useState<GigData[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGig, setSelectedGig] = useState<GigData | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

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
          setError(
            "Location access denied. Please enable location to see nearby gigs.",
          );
          setLoading(false);
        },
      );
    } else {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
    }
  }, []);

  // Fetch gigs from Firestore
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gigs"));
        const gigsData = querySnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
            datetime: doc.data().datetime.toDate(),
          }),
        ) as GigData[];
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
          gig.location.longitude,
        ),
      }))
      .filter((gig) => gig.distance !== undefined && gig.distance <= radius)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [gigs, userLocation, radius]);

  // Load Leaflet CSS & JS dynamically
  useEffect(() => {
    if (showMap && !mapLoaded) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    }
  }, [showMap, mapLoaded]);

  // Initialize Leaflet map
  useEffect(() => {
    if (showMap && mapLoaded && selectedGig && userLocation) {
      const mapContainer = document.getElementById("gig-map");
      if (!mapContainer) return;

      // @ts-ignore - Leaflet loaded from CDN
      const L = window.L;
      if (!L) return;

      // Clear previous map instance
      mapContainer.innerHTML = "";

      const map = L.map("gig-map").setView(
        [selectedGig.location.latitude, selectedGig.location.longitude],
        14,
      );

      // Add OpenStreetMap tiles (FREE!)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Add marker for gig location
      L.marker([selectedGig.location.latitude, selectedGig.location.longitude])
        .addTo(map)
        .bindPopup(
          `<b>${selectedGig.title}</b><br>${selectedGig.locationName || "Gig Location"}`,
        )
        .openPopup();

      // Add marker for user location (blue dot)
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
        .addTo(map)
        .bindPopup("Your Location");

      // Draw route line between user and gig
      L.polyline(
        [
          [userLocation.lat, userLocation.lon],
          [selectedGig.location.latitude, selectedGig.location.longitude],
        ],
        {
          color: "#3b82f6",
          weight: 3,
          opacity: 0.7,
          dashArray: "10, 10",
        },
      ).addTo(map);

      // Fit bounds to show both markers
      const bounds = L.latLngBounds([
        [userLocation.lat, userLocation.lon],
        [selectedGig.location.latitude, selectedGig.location.longitude],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [showMap, mapLoaded, selectedGig, userLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mb-4"></div>
          <p className="text-white/60 font-light">Finding gigs near you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-red-400 font-light">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-2">
            Nearby Gigs
          </h1>
          <p className="text-white/40 text-sm font-light">
            Discover live music near you
          </p>
        </div>

        {/* Radius Filter */}
        <div className="flex justify-end mb-8">
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="bg-transparent border border-white/10 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-white/40 transition-colors font-light [color-scheme:dark]"
          >
            <option value={1}>Within 1 km</option>
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={25}>Within 25 km</option>
            <option value={100}>Within 100 km</option>
          </select>
        </div>

        {/* Gigs List */}
        <div className="space-y-4">
          {filteredAndSortedGigs.length > 0 ? (
            filteredAndSortedGigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-light text-white mb-3">
                      {gig.title}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-white/60 font-light">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        {gig.datetime.toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <div className="flex items-center text-sm text-white/60 font-light">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {gig.distance?.toFixed(1)} km away
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGig(gig);
                      setShowMap(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-light transition-all"
                  >
                    <Info className="w-4 h-4" />
                    Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-lg">
              <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-light text-white mb-2">
                No gigs nearby
              </h3>
              <p className="text-white/40 text-sm font-light">
                Try increasing the search radius or check back later
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-light text-white">Gig Details</h2>
              <button
                onClick={() => {
                  setSelectedGig(null);
                  setShowMap(false);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-light text-white mb-4">
                  {selectedGig.title}
                </h3>

                {selectedGig.description && (
                  <p className="text-white/60 font-light leading-relaxed">
                    {selectedGig.description}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-1">
                      Date & Time
                    </p>
                    <p className="text-white font-light">
                      {selectedGig.datetime.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-white/60 text-sm font-light">
                      {selectedGig.datetime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-1">
                      Location
                    </p>
                    <p className="text-white font-light">
                      {selectedGig.locationName || "Gig Location"}
                    </p>
                    <p className="text-white/60 text-sm font-light mt-1">
                      {selectedGig.distance?.toFixed(2)} km from your location
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Toggle Button */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black hover:bg-white/90 transition-colors font-medium text-sm"
              >
                <MapPin className="w-4 h-4" />
                {showMap ? "Hide Map" : "Show on Map"}
              </button>

              {/* Map Container */}
              {showMap && (
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <div id="gig-map" className="w-full h-96 bg-white/5"></div>
                  <div className="bg-white/5 px-4 py-2 border-t border-white/10">
                    <p className="text-xs text-white/40 font-light text-center">
                      Powered by OpenStreetMap (Free & Open Source)
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedGig.location.latitude},${selectedGig.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-light transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
                <button
                  onClick={() => {
                    setSelectedGig(null);
                    setShowMap(false);
                  }}
                  className="flex-1 py-3 bg-transparent hover:bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm font-light transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
