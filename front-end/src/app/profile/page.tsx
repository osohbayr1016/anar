"use client";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "../components/Header";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const {
    cart,
    wishlist,
    favorites,
    recentlyViewed,
    removeFromCart,
    updateCartQuantity,
    removeFromWishlist,
    removeFromFavorites,
    addToCart,
  } = useUser();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User Info Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-black">{user.name}</h1>
                  <p className="text-gray-700">{user.email}</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-gray-100 text-black text-sm rounded-full border border-gray-200">
                    {user.role === "admin" ? "Админ" : "Хэрэглэгч"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/orders"
                  className="bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
                >
                  Захиалгууд
                </Link>
                <Link
                  href="/profile/settings"
                  className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-800 text-sm sm:text-base"
                >
                  Тохиргоо
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Худалдан авах сагс ({cart.length})
            </h2>
            {cart.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-4"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate text-black">
                            {item.name}
                          </h3>
                          <p className="text-gray-700">${item.price}</p>
                          <span className="text-xs text-gray-600">
                            {item.category === "Male"
                              ? "Эрэгтэй"
                              : item.category === "Female"
                              ? "Эмэгтэй"
                              : "Хүүхэд"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 bg-gray-200 text-black rounded hover:bg-gray-300 flex items-center justify-center font-semibold"
                          >
                            -
                          </button>
                          <span className="px-3 sm:px-4 font-medium text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 bg-gray-200 text-black rounded hover:bg-gray-300 flex items-center justify-center font-semibold"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-right text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => {
                            removeFromCart(item.id);
                            showToast("Сагснаас хасагдлаа", "success");
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
                  <p className="text-xl font-bold text-black">Нийт:</p>
                  <p className="text-2xl font-bold text-black">
                    ${cartTotal.toFixed(2)}
                  </p>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full mt-4 bg-black text-white py-3 rounded-lg hover:bg-gray-800 text-center font-semibold"
                >
                  Захиалга руу шилжих
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Таны сагс хоосон байна
                </h3>
                <p className="text-gray-700 mb-6">
                  Бүтээгдэхүүн сонгож эхлээрэй!
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Бүтээгдэхүүн үзэх
                </Link>
              </div>
            )}
          </section>

          {/* Wishlist Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Хүслийн жагсаалт ({wishlist.length})
            </h2>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="w-full aspect-square bg-gray-100 rounded mb-3"></div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600 mb-3">${product.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          addToCart(product);
                          showToast("Сагсанд нэмэгдлээ", "success");
                        }}
                        className="flex-1 bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                      >
                        Сагсанд нэмэх
                      </button>
                      <button
                        onClick={() => {
                          removeFromWishlist(product.id);
                          showToast("Хүслийн жагсаалтаас хасагдлаа", "success");
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Хүслийн жагсаалт хоосон байна
                </h3>
                <p className="text-gray-700 mb-6">
                  Таалагдсан бүтээгдэхүүнүүдээ энд хадгална уу
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Бүтээгдэхүүн үзэх
                </Link>
              </div>
            )}
          </section>

          {/* Favorites Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Дуртай ({favorites.length})
            </h2>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="w-full aspect-square bg-gray-100 rounded mb-3"></div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600 mb-3">${product.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          addToCart(product);
                          showToast("Сагсанд нэмэгдлээ", "success");
                        }}
                        className="flex-1 bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                      >
                        Сагсанд нэмэх
                      </button>
                      <button
                        onClick={() => {
                          removeFromFavorites(product.id);
                          showToast("Дуртай жагсаалтаас хасагдлаа", "success");
                        }}
                        className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Дуртай бүтээгдэхүүн байхгүй
                </h3>
                <p className="text-gray-700 mb-6">
                  Онцгой бүтээгдэхүүнүүдээ тэмдэглээрэй
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Бүтээгдэхүүн үзэх
                </Link>
              </div>
            )}
          </section>

          {/* Recently Viewed Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-black">
              Сүүлд үзсэн ({recentlyViewed.length})
            </h2>
            {recentlyViewed.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recentlyViewed.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md p-3"
                  >
                    <div className="w-full aspect-square bg-gray-100 rounded mb-2"></div>
                    <h3 className="font-semibold text-sm truncate text-black">
                      {product.name}
                    </h3>
                    <p className="text-gray-700 text-sm">${product.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Үзсэн түүх хоосон байна
                </h3>
                <p className="text-gray-700 mb-6">
                  Та үзсэн бүтээгдэхүүнүүд энд харагдана
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Бүтээгдэхүүн үзэх
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
