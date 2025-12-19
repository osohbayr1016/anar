"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    maleProducts: 0,
    femaleProducts: 0,
    childrenProducts: 0,
    accessoriesProducts: 0,
  });

  useEffect(() => {
    // Fetch products for stats
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then((products: { category: string }[]) => {
        setStats({
          totalProducts: products.length,
          maleProducts: products.filter((p) => p.category === "Male").length,
          femaleProducts: products.filter((p) => p.category === "Female")
            .length,
          childrenProducts: products.filter((p) => p.category === "Children")
            .length,
          accessoriesProducts: products.filter(
            (p) => p.category === "Accessories"
          ).length,
        });
      });
  }, []);

  const collections = [
    {
      title: "Male Collection",
      href: "/admin/male",
      count: stats.maleProducts,
      color: "from-blue-500 to-blue-600",
      icon: "👔",
    },
    {
      title: "Female Collection",
      href: "/admin/female",
      count: stats.femaleProducts,
      color: "from-pink-500 to-pink-600",
      icon: "👗",
    },
    {
      title: "Children Collection",
      href: "/admin/children",
      count: stats.childrenProducts,
      color: "from-yellow-500 to-yellow-600",
      icon: "🎒",
    },
    {
      title: "Accessories Collection",
      href: "/admin/accessories",
      count: stats.accessoriesProducts,
      color: "from-purple-500 to-purple-600",
      icon: "👜",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              Админ самбар
            </h1>
            <p className="text-black mt-2 text-sm sm:text-base">
              Дэлгүүрийн бүтээгдэхүүн, хэрэглэгчдийг удирдах
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm">Нийт бүтээгдэхүүн</p>
                  <p className="text-3xl font-bold mt-1 text-black">
                    {stats.totalProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                  📦
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm">Эрэгтэй</p>
                  <p className="text-3xl font-bold mt-1 text-black">
                    {stats.maleProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl">
                  👔
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm">Эмэгтэй</p>
                  <p className="text-3xl font-bold mt-1 text-black">
                    {stats.femaleProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-2xl">
                  👗
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm">Хүүхэд</p>
                  <p className="text-3xl font-bold mt-1 text-black">
                    {stats.childrenProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-2xl">
                  🎒
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm">Аксессуар</p>
                  <p className="text-3xl font-bold mt-1 text-black">
                    {stats.accessoriesProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                  👜
                </div>
              </div>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {collections.map((collection) => (
              <Link
                key={collection.href}
                href={collection.href}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${collection.color} flex items-center justify-center text-6xl`}
                >
                  {collection.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black group-hover:text-gray-600 transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-black mt-1">
                    {collection.count} бүтээгдэхүүн
                  </p>
                  <div className="mt-4 flex items-center text-black font-medium">
                    Удирдах
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Хурдан үйлдлүүд
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <Link
                href="/admin/orders"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  📦
                </div>
                <div>
                  <p className="font-semibold text-black">Захиалга</p>
                  <p className="text-sm text-black">Удирдах</p>
                </div>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  👥
                </div>
                <div>
                  <p className="font-semibold text-black">Хэрэглэгч</p>
                  <p className="text-sm text-black">Удирдах</p>
                </div>
              </Link>
              <Link
                href="/admin/support"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  💬
                </div>
                <div>
                  <p className="font-semibold text-black">Дэмжлэг</p>
                  <p className="text-sm text-black">Tickets</p>
                </div>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  🏷️
                </div>
                <div>
                  <p className="font-semibold text-black">Ангилал</p>
                  <p className="text-sm text-black">Удирдах</p>
                </div>
              </Link>
              <Link
                href="/"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  🏠
                </div>
                <div>
                  <p className="font-semibold text-black">Дэлгүүр</p>
                  <p className="text-sm text-black">Үзэх</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
