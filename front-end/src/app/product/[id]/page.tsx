"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import ProductCard from "@/app/components/ProductCard";
import { ProductDetailSkeleton } from "@/app/components/SkeletonLoading";

type ColorStock = {
  color: string;
  quantity: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: "Male" | "Female" | "Children";
  description?: string;
  colors?: ColorStock[];
  totalStock?: number;
};

type Review = {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const {
    addToCart,
    addToWishlist,
    addToFavorites,
    addToRecentlyViewed,
    isInWishlist,
    isInFavorites,
  } = useUser();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const mockImages = [1, 2, 3, 4]; // Placeholder images

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
      addToRecentlyViewed(data);

      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0].color);
      }

      // Fetch related products
      const allRes = await fetch(`${API_BASE}/api/products`);
      const allProducts = await allRes.json();
      const related = allProducts
        .filter(
          (p: Product) => p.category === data.category && p.id !== data.id
        )
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/product/${id}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Үнэлгээ бичихийн тулд нэвтэрнэ үү", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Үнэлгээ амжилттай нэмэгдлээ!", "success");
        setReviewForm({ rating: 5, comment: "" });
        setShowReviewForm(false);
        fetchReviews();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("Үнэлгээ нэмэхэд алдаа гарлаа", "error");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      showToast(`${quantity} ширхэг сагсанд нэмэгдлээ!`, "success");
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        showToast("Аль хэдийн хүслийн жагсаалтад байна", "info");
      } else {
        addToWishlist(product);
        showToast("Хүслийн жагсаалтад нэмэгдлээ!", "success");
      }
    }
  };

  const handleAddToFavorites = () => {
    if (product) {
      if (isInFavorites(product.id)) {
        showToast("Аль хэдийн дуртай жагсаалтад байна", "info");
      } else {
        addToFavorites(product);
        showToast("Дуртай жагсаалтад нэмэгдлээ!", "success");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductDetailSkeleton />
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-black">Бүтээгдэхүүн олдсонгүй</h2>
            <Link href="/products" className="text-black hover:underline">
              Бүх бүтээгдэхүүн үзэх
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-black mb-6 sm:mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-gray-600">
              Нүүр
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="hover:text-gray-600">
              Бүтээгдэхүүн
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/collections/${product.category.toLowerCase()}`}
              className="hover:text-gray-600"
            >
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image Gallery */}
            <div className="sticky top-20 self-start">
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl sm:text-6xl">
                  📦
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {mockImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg hover:ring-2 hover:ring-black transition ${
                      currentImageIndex === index ? "ring-2 ring-black" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="pb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-black">
                {product.name}
              </h1>
              <p className="text-black mb-4">
                {product.category} Collection
              </p>
              <div className="flex items-center space-x-2 sm:space-x-4 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm sm:text-base text-black">
                    (24 үнэлгээ)
                  </span>
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-bold text-black mb-6">
                ${product.price}
              </div>

              <p className="text-black mb-6">{product.description}</p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-black">
                    Өнгө: <span className="text-black">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.color}
                        onClick={() => setSelectedColor(color.color)}
                        className={`px-4 py-2 border-2 rounded-lg hover:border-black transition ${
                          selectedColor === color.color
                            ? "border-black bg-black text-white"
                            : "border-gray-300 text-black"
                        }`}
                      >
                        {color.color} ({color.quantity})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">
                  Хэмжээ: <span className="text-black">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border-2 rounded-lg hover:border-black transition font-medium ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">
                  Тоо ширхэг
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-black text-black font-semibold"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center text-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-black text-black font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white py-3 sm:py-4 rounded-lg hover:bg-gray-800 transition font-semibold text-base sm:text-lg"
                >
                  Сагсанд нэмэх
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="w-full sm:w-14 h-12 sm:h-14 border-2 border-gray-300 rounded-lg hover:border-black flex items-center justify-center text-black"
                >
                  <svg
                    className="w-6 h-6"
                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </button>
                <button
                  onClick={handleAddToFavorites}
                  className="w-full sm:w-14 h-12 sm:h-14 border-2 border-gray-300 rounded-lg hover:border-black flex items-center justify-center text-black"
                >
                  <svg
                    className="w-6 h-6"
                    fill={isInFavorites(product.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>

              {/* Stock Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  ✓ {product.totalStock || 0} ширхэг бараа бэлэн байна
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 lg:mb-16">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-black">
                Үнэлгээ ба сэтгэгдэл ({reviews.length})
              </h2>
              {user && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto"
                >
                  {showReviewForm ? "Хаах" : "Үнэлгээ бичих"}
                </button>
              )}
            </div>

            {showReviewForm && (
              <form
                onSubmit={submitReview}
                className="mb-8 bg-white border border-gray-200 p-4 rounded-lg"
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">
                    Үнэлгээ
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm({ ...reviewForm, rating: star })
                        }
                      >
                        <svg
                          className={`w-8 h-8 ${
                            star <= reviewForm.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">
                    Сэтгэгдэл
                  </label>
                  <textarea
                    required
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white"
                    rows={4}
                    placeholder="Бүтээгдэхүүний талаар санал бичнэ үү..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                >
                  Үнэлгээ илгээх
                </button>
              </form>
            )}

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b pb-6 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-black">{review.userName}</p>
                        <p className="text-xs text-black">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-black">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-black">
                {user
                  ? "Эхний үнэлгээг та бичээрэй!"
                  : "Одоогоор үнэлгээ байхгүй байна"}
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">
                Холбоотой бүтээгдэхүүн
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
