"use client";
import Header from "@/app/components/Header";
import ProductManagement from "@/app/components/ProductManagement";
import Link from "next/link";

export default function AdminAccessoriesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 sm:mb-6">
            <Link
              href="/admin"
              className="text-black hover:text-gray-600 font-medium flex items-center mb-4 text-sm sm:text-base transition-colors"
            >
              ← Буцах
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                👜
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                  Аксессуар цуглуулга
                </h1>
                <p className="text-black text-sm sm:text-base">
                  Аксессуар бүтээгдэхүүн удирдах
                </p>
              </div>
            </div>
          </div>
          <ProductManagement category="Accessories" />
        </div>
      </main>
    </>
  );
}
