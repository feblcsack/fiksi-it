// app/gig/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getGigById } from '@/services/gigService';
import { Gig } from '@/types';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import FollowButton from '@/components/FollowButton';

export default function GigDetailPage() {
  const params = useParams();
  const gigId = params.id as string;
  
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewRefresh, setReviewRefresh] = useState(0);

  useEffect(() => {
    const loadGig = async () => {
      try {
        setLoading(true);
        const gigData = await getGigById(gigId);
        
        if (!gigData) {
          setError('Gig tidak ditemukan');
          return;
        }
        
        setGig(gigData);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat detail gig');
      } finally {
        setLoading(false);
      }
    };

    if (gigId) {
      loadGig();
    }
  }, [gigId]);

  const handleReviewAdded = () => {
    setReviewRefresh(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg">
          {error || 'Gig tidak ditemukan'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {gig.coverImage && (
            <img
              src={gig.coverImage}
              alt={gig.namaAcara}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{gig.namaAcara}</h1>
            <p className="text-xl text-gray-600 mb-4">🎸 {gig.musisiName}</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">📅 Waktu</h3>
                <p className="text-gray-600">
                  {new Date(gig.jamMulai).toLocaleString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">📍 Lokasi</h3>
                <p className="text-gray-600">{gig.lokasi.alamat}</p>
                <p className="text-xs text-gray-500">
                  ({gig.lokasi.latitude.toFixed(6)}, {gig.lokasi.longitude.toFixed(6)})
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">📝 Deskripsi</h3>
              <p className="text-gray-600 whitespace-pre-line">{gig.deskripsi}</p>
            </div>

            <div className="border-t pt-6">
              <FollowButton musisiId={gig.musisiId} />
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <ReviewForm gigId={gigId} onReviewAdded={handleReviewAdded} />
          </div>
          
          <div>
            <ReviewList gigId={gigId} refreshTrigger={reviewRefresh} />
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <a
            href="/dashboard"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 font-semibold"
          >
            ← Kembali ke Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}