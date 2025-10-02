// src/components/features/GigForm.tsx
"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GeoPoint } from 'firebase/firestore';
import { useAuth } from '@/lib/hooks/useAuth';

// Definisikan tipe untuk hasil pencarian lokasi
interface LocationSearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const GigForm = () => {
  const { user } = useAuth(); // Dapatkan data user yang sedang login
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<LocationSearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fungsi untuk mencari lokasi menggunakan Nominatim API
  const handleLocationSearch = async () => {
    if (locationQuery.length < 3) return;
    
    // URL API Nominatim untuk pencarian di Indonesia
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&countrycodes=id&limit=5`;

    try {
      const response = await fetch(searchUrl);
      const data: LocationSearchResult[] = await response.json();
      setLocationResults(data);
    } catch (err) {
      console.error("Failed to fetch location", err);
    }
  };
  
  // Fungsi untuk menyimpan data gig ke Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !datetime || !selectedLocation || !user) {
      setError("Please fill all fields and select a location.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await addDoc(collection(db, "gigs"), {
        title,
        description,
        datetime: new Date(datetime),
        location: new GeoPoint(parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)),
        musisiId: user.uid, // Simpan ID musisi yang membuat gig
        createdAt: serverTimestamp(),
      });

      setSuccess("Gig created successfully!");
      // Reset form
      setTitle('');
      setDescription('');
      setDatetime('');
      setLocationQuery('');
      setLocationResults([]);
      setSelectedLocation(null);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Gig</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input fields for title, description, datetime */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Gig Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">Date and Time</label>
          <input id="datetime" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>

        {/* Location Search Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <div className="flex gap-2">
            <input id="location" type="text" value={locationQuery} onChange={(e) => { setLocationQuery(e.target.value); setSelectedLocation(null); }} placeholder="Search for a place in Indonesia..." className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            <button type="button" onClick={handleLocationSearch} className="mt-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700">Search</button>
          </div>
          {selectedLocation && <p className="text-sm text-green-600 mt-2">Selected: {selectedLocation.display_name}</p>}
        </div>

        {/* Location Search Results */}
        {locationResults.length > 0 && !selectedLocation && (
          <ul className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
            {locationResults.map(loc => (
              <li key={loc.place_id} onClick={() => { setSelectedLocation(loc); setLocationResults([]); setLocationQuery(loc.display_name); }} className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                {loc.display_name}
              </li>
            ))}
          </ul>
        )}
        
        {/* Submit Button & Messages */}
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
            {isLoading ? 'Creating...' : 'Create Gig'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}
      </form>
    </div>
  );
};