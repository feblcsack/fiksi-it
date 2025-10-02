// src/components/features/GigForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { db, storage } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { GeoPoint } from "firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";
import { Timestamp } from "firebase/firestore";
import { MapPin, Search, Check, Loader2, UploadCloud } from "lucide-react";

interface LocationSearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const GigForm = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bandName, setBandName] = useState("");
  const [bandLogo, setBandLogo] = useState<File | null>(null);
  const [bandLogoPreview, setBandLogoPreview] = useState<string | null>(null);
  const [datetime, setDatetime] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<
    LocationSearchResult[]
  >([]);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-search dengan debounce
  useEffect(() => {
    if (locationQuery.length >= 3 && !selectedLocation) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        handleLocationSearch();
      }, 500);
    } else {
      setLocationResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [locationQuery, selectedLocation]);

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSearch = async () => {
    setIsSearching(true);
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&countrycodes=id&limit=5&addressdetails=1`;

    try {
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "GigFinderApp/1.0",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const data: LocationSearchResult[] = await response.json();
      setLocationResults(data);
      setShowResults(data.length > 0);
    } catch (err) {
      console.error("Failed to fetch location", err);
      setLocationResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (location: LocationSearchResult) => {
    setSelectedLocation(location);
    setLocationQuery(location.display_name);
    setShowResults(false);
    setLocationResults([]);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBandLogo(file);
      setBandLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !datetime || !selectedLocation || !user) {
      setError("Please fill all required fields and select a location.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      let bandLogoUrl = "";
      if (bandLogo) {
        const storageRef = ref(
          storage,
          `band_logos/${user.uid}-${Date.now()}-${bandLogo.name}`,
        );
        await uploadBytes(storageRef, bandLogo);
        bandLogoUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "gigs"), {
        title,
        description,
        bandName,
        bandLogoUrl,
        datetime: Timestamp.fromDate(new Date(datetime)),
        location: new GeoPoint(
          parseFloat(selectedLocation.lat),
          parseFloat(selectedLocation.lon),
        ),
        locationName: selectedLocation.display_name,
        musisiId: user.uid,
        createdAt: serverTimestamp(),
      });

      setSuccess("Gig created successfully!");

      // Reset form
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setDatetime("");
        setLocationQuery("");
        setLocationResults([]);
        setSelectedLocation(null);
        setSuccess(null);
        setBandName("");
        setBandLogo(null);
        setBandLogoPreview(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create gig. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-2">
            Create New Gig
          </h1>
          <p className="text-white/40 text-sm font-light">
            Fill in the details to create your gig listing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Field */}
          <div className="space-y-3">
            <label
              htmlFor="title"
              className="block text-xs font-mono text-white/40 uppercase tracking-wider"
            >
              Gig Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter gig title"
              required
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors font-light"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-3">
            <label
              htmlFor="description"
              className="block text-xs font-mono text-white/40 uppercase tracking-wider"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your gig (optional)"
              rows={4}
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors resize-none font-light"
            />
          </div>

          {/* Band Name Field */}
          <div className="space-y-3">
            <label
              htmlFor="bandName"
              className="block text-xs font-mono text-white/40 uppercase tracking-wider"
            >
              Band / Artist Name
            </label>
            <input
              id="bandName"
              type="text"
              value={bandName}
              onChange={(e) => setBandName(e.target.value)}
              placeholder="Enter your band or artist name (optional)"
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors font-light"
            />
          </div>

          {/* Band Logo Field */}
          <div className="space-y-3">
            <label className="block text-xs font-mono text-white/40 uppercase tracking-wider">
              Band Logo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {bandLogoPreview ? (
                <img
                  src={bandLogoPreview}
                  alt="Band logo preview"
                  className="w-16 h-16 rounded-lg object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <UploadCloud className="h-6 w-6 text-white/40" />
                </div>
              )}
              <div className="flex-grow">
                <input
                  id="bandLogo"
                  type="file"
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="block w-full text-sm text-white/60 font-light file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* DateTime Field */}
          <div className="space-y-3">
            <label
              htmlFor="datetime"
              className="block text-xs font-mono text-white/40 uppercase tracking-wider"
            >
              Date and Time <span className="text-red-400">*</span>
            </label>
            <input
              id="datetime"
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors font-light [color-scheme:dark]"
            />
          </div>

          {/* Location Field */}
          <div className="space-y-3 relative" ref={resultsRef}>
            <label
              htmlFor="location"
              className="block text-xs font-mono text-white/40 uppercase tracking-wider"
            >
              Location <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="location"
                type="text"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setSelectedLocation(null);
                }}
                onFocus={() =>
                  locationResults.length > 0 && setShowResults(true)
                }
                placeholder="Search location in Indonesia..."
                className="w-full bg-transparent border border-white/10 pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors font-light"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </div>
              {selectedLocation && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Location Results Dropdown */}
            {showResults && locationResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-black border border-white/10 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                {locationResults.map((loc) => (
                  <button
                    key={loc.place_id}
                    type="button"
                    onClick={() => handleLocationSelect(loc)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 focus:outline-none focus:bg-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/80 font-light line-clamp-2">
                        {loc.display_name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedLocation && (
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-2 rounded-md">
                <Check className="h-3 w-3" />
                <span className="font-light">Location selected</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-sm text-red-400 font-light">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              <p className="text-sm text-green-400 font-light">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium text-sm hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                CREATING GIG...
              </>
            ) : (
              "CREATE GIG"
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-xs text-white/20 text-center mt-8 font-light">
          All fields marked with <span className="text-red-400">*</span> are
          required
        </p>
      </div>
    </div>
  );
};
