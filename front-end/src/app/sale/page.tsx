"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/SkeletonLoading";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: "Male" | "Female" | "Children" | "Accessories";
  description?: string;
  originalPrice?: number;
};

export const dynamic = "force-dynamic";

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        // Хямдралтай бүтээгдэхүүн (originalPrice байгаа эсвэл тодорхой категориас)
        const saleProducts = data.filter((p) => {
          // Энэ жишээнд бүх бүтээгдэхүүнийг харуулна, гэхдээ бодит тохиолдолд originalPrice шалгана
          return p.originalPrice || Math.random() > 0.7; // Жишээ: 30% нь хямдралтай
        });
        setProducts(saleProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-black mb-6">
            <Link href="/" className="hover:text-gray-600">
              Нүүр
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">Хямдрал</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black">
              Хямдрал
            </h1>
            <p className="text-lg text-black">Онцгой үнээр бүтээгдэхүүнүүд</p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="relative w-full aspect-square bg-gray-100 mb-3 overflow-hidden rounded-xl">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        style={{ backgroundImage: `url(${product.imageUrl})` }}
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                        ХЯМДРАЛ
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      {product.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                      )}
                      <p className="text-gray-900 font-semibold">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      href={`/product/${product.id}`}
                      className="block w-full bg-black text-white px-4 py-2 text-sm font-medium text-center hover:bg-gray-800 transition-all duration-300 ease-in-out rounded-lg"
                    >
                      Дэлгэрэнгүй
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-black text-lg mb-4">
                Одоогоор хямдралтай бүтээгдэхүүн байхгүй байна.
              </p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out"
              >
                Бүх бүтээгдэхүүн үзэх
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
