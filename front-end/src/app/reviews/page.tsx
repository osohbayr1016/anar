"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

type Review = {
  _id: string;
  productId: string;
  productName?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const dynamic = "force-dynamic";

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">(
    "all"
  );

  useEffect(() => {
    // Бүх бүтээгдэхүүний review-уудыг авах
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then(async (products) => {
        const allReviews: Review[] = [];
        for (const product of products) {
          try {
            const res = await fetch(
              `${API_BASE}/api/reviews/product/${product.id}`
            );
            const data = await res.json();
            if (data.success && data.reviews) {
              const productReviews = data.reviews.map((review: Review) => ({
                ...review,
                productName: product.name,
                productId: product.id,
              }));
              allReviews.push(...productReviews);
            }
          } catch (error) {
            console.error(`Error fetching reviews for product ${product.id}:`, error);
          }
        }
        // Огноогоор эрэмбэлэх (шинэ нь эхэнд)
        allReviews.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(allReviews);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(filter));

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-black mb-8">
            <Link href="/" className="hover:text-gray-600">
              Нүүр
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">Үнэлгээ</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black">
              Хэрэглэгчдийн үнэлгээ
            </h1>
            <p className="text-lg text-black mb-6">
              Манай хэрэглэгчдийн бүтээгдэхүүний талаарх сэтгэгдэл
            </p>

            {/* Rating Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-5xl font-bold mb-2 text-black">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center sm:justify-start mb-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <p className="text-black">
                    {reviews.length} үнэлгээний дундаж
                  </p>
                </div>
                <div className="flex-1 max-w-md">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <span className="text-sm w-8 text-black">{rating} од</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${
                              reviews.length > 0
                                ? (ratingCounts[rating as keyof typeof ratingCounts] /
                                    reviews.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-black w-12 text-right">
                        {ratingCounts[rating as keyof typeof ratingCounts]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200 border border-gray-200"
                }`}
              >
                Бүгд ({reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilter(rating.toString() as typeof filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === rating.toString()
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {rating} од ({ratingCounts[rating as keyof typeof ratingCounts]})
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-black">
                          {review.userName}
                        </h3>
                        {renderStars(review.rating)}
                      </div>
                      {review.productName && (
                        <Link
                          href={`/product/${review.productId}`}
                          className="text-sm text-black hover:text-gray-600"
                        >
                          {review.productName}
                        </Link>
                      )}
                    </div>
                    <p className="text-sm text-black">
                      {new Date(review.createdAt).toLocaleDateString("mn-MN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-black leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-black text-lg mb-4">
                {filter === "all"
                  ? "Одоогоор үнэлгээ байхгүй байна."
                  : `${filter} одтой үнэлгээ олдсонгүй.`}
              </p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out"
              >
                Бүтээгдэхүүн үзэх
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}


