// components/ReviewList.tsx
"use client";

import { useEffect, useState } from "react";
import { getReviewsByGig, getAverageRating } from "@/services/reviewService";
import { Review } from "@/types";

interface ReviewListProps {
  gigId: string;
  refreshTrigger?: number;
}

export default function ReviewList({ gigId, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      const [reviewsData, avgRating] = await Promise.all([
        getReviewsByGig(gigId),
        getAverageRating(gigId),
      ]);
      setReviews(reviewsData);
      setAverageRating(avgRating);
    } catch (err: any) {
      setError(err.message || "Gagal memuat reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [gigId, refreshTrigger]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Reviews</h3>
        {reviews.length > 0 ? (
          <div className="flex items-center gap-3">
            {renderStars(Math.round(averageRating))}
            <span className="text-lg font-semibold">
              {averageRating.toFixed(1)}/5
            </span>
            <span className="text-sm text-gray-600">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        ) : (
          <p className="text-gray-600">Belum ada review</p>
        )}
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-800">{review.userName}</p>
                {renderStars(review.rating)}
              </div>
              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <p className="text-gray-700 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
