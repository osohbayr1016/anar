"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: "Male" | "Female" | "Children";
  description?: string;
};

export default function HomePage() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        // Latest products (most recent)
        const latest = [...data].slice(0, 8);
        setLatestProducts(latest);

        // Best sellers (can be filtered by popularity or just use some products)
        const sellers = [...data].slice(0, 4);
        setBestSellers(sellers);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section - Shop the Faves */}
        <section className="text-center py-16 sm:py-24 px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-black">
            Дуртай бүтээгдэхүүн
          </h1>
          <p className="text-lg sm:text-xl text-black mb-8">
            Манай дуртай. Таны дуртай.
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Бүтээгдэхүүн үзэх
          </Link>
        </section>

        {/* Featured Collections */}
        <section className="py-12 sm:py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Link href="/collections/male" className="group">
                <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center hover:scale-[1.02] transition-transform rounded-xl">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-black">
                      ЭРЭГТЭЙ ЦУГЛУУЛГА
                    </h2>
                    <p className="text-sm sm:text-base text-black">
                      Эрэгтэйчүүдийн хувцаслалт
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/collections/female" className="group">
                <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center hover:scale-[1.02] transition-transform rounded-xl">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-black">
                      ЭМЭГТЭЙ ЦУГЛУУЛГА
                    </h2>
                    <p className="text-sm sm:text-base text-black">
                      Эмэгтэйчүүдийн хувцаслалт
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <Link href="/collections/children" className="block group">
              <div className="bg-gray-100 aspect-[16/6] flex items-center justify-center hover:scale-[1.02] transition-transform rounded-xl">
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-black">
                    ХҮҮХДИЙН ЦУГЛУУЛГА
                  </h2>
                  <p className="text-base sm:text-lg text-black">
                    Хүүхдийн тав тухтай хувцас
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-black">
                Хамгийн их борлуулалт
              </h2>
              <p className="text-black mb-6">МАШ ХУДАЛДААНД ГАРЧ БАЙНА</p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                ОДОО ХУДАЛДАЖ АВАХ
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Latest Drops */}
        <section className="py-12 sm:py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-black">
                Шинэ бүтээгдэхүүн
              </h2>
              <p className="text-black">Хувцас болон бусад</p>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-block text-black underline text-sm font-medium hover:text-gray-600"
              >
                Бүгдийг харах
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-black text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-lg sm:text-xl mb-4">
              Монголд бүтээгдсэн. Дэлхий даяар өмсөгддөг.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Anar Shop бол загварын сонирхолтой хүмүүсийн бүтээл юм.
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <Link href="/products" className="text-sm hover:text-gray-400">
                Дэлгүүр
              </Link>
              <Link href="/auth/login" className="text-sm hover:text-gray-400">
                Данс
              </Link>
              {process.env.NODE_ENV === "development" && (
                <Link href="/admin" className="text-sm hover:text-gray-400">
                  Админ
                </Link>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Зохиогчийн эрх © {new Date().getFullYear()}, Anar Shop. Бүх эрх
              хуулиар хамгаалагдсан.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
