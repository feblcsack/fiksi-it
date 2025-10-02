// components/ReviewForm.tsx
"use client";

import { useState } from "react";
import { addReview } from "@/services/reviewService";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewFormProps {
  gigId: string;
  onReviewAdded?: () => void;
}

export default function ReviewForm({ gigId, onReviewAdded }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!user) {
      setError("Harus login untuk memberikan review");
      setLoading(false);
      return;
    }

    if (user.role === "musisi") {
      setError("Musisi tidak bisa memberikan review");
      setLoading(false);
      return;
    }

    try {
      await addReview({
        gigId,
        userId: user.uid,
        userName: user.displayName || user.email,
        rating,
        comment,
      });

      setSuccess(true);
      setComment("");
      setRating(5);

      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan review");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role === "musisi") {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded">
        Login sebagai user untuk memberikan review
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Berikan Review</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Review berhasil ditambahkan!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">Rating: {rating}/5</p>
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Komentar
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Bagaimana pengalaman kamu di event ini?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Mengirim..." : "Kirim Review"}
        </button>
      </form>
    </div>
  );
}
