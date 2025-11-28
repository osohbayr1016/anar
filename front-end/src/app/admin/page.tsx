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
        });
      });
  }, []);

  const collections = [
    {
      title: "Эрэгтэй цуглуулга",
      href: "/admin/male",
      count: stats.maleProducts,
      color: "from-blue-500 to-blue-600",
      icon: "👔",
    },
    {
      title: "Эмэгтэй цуглуулга",
      href: "/admin/female",
      count: stats.femaleProducts,
      color: "from-pink-500 to-pink-600",
      icon: "👗",
    },
    {
      title: "Хүүхдийн цуглуулга",
      href: "/admin/children",
      count: stats.childrenProducts,
      color: "from-yellow-500 to-yellow-600",
      icon: "🎒",
    },
  ];

  const navItems = [
    {
      href: "/admin/male",
      label: "Эрэгтэй",
      icon: "👔",
      count: stats.maleProducts,
    },
    {
      href: "/admin/female",
      label: "Эмэгтэй",
      icon: "👗",
      count: stats.femaleProducts,
    },
    {
      href: "/admin/children",
      label: "Хүүхэд",
      icon: "🎒",
      count: stats.childrenProducts,
    },
    { href: "/admin/about", label: "Бидний тухай", icon: "ℹ️" },
    { href: "/admin/orders", label: "Захиалга", icon: "📦" },
    { href: "/admin/users", label: "Хэрэглэгч", icon: "👥" },
    { href: "/admin/support", label: "Дэмжлэг", icon: "💬" },
    { href: "/admin/categories", label: "Ангилал", icon: "🏷️" },
    { href: "/", label: "Дэлгүүр", icon: "🏠" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 lg:min-h-screen lg:sticky lg:top-16">
          <div className="p-4 lg:p-6">
            <h2 className="text-xl font-bold text-black mb-4 lg:mb-6">
              Админ самбар
            </h2>
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors group whitespace-nowrap lg:w-full"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-black font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full ml-2">
                      {item.count}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
                Админ самбар
              </h1>
              <p className="text-black">
                Дэлгүүрийн бүтээгдэхүүн, хэрэглэгчдийг удирдах
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {collections.map((collection) => (
                <Link
                  key={collection.href}
                  href={collection.href}
                  className="group bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">{collection.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-black">
                        {collection.title}
                      </h3>
                      <p className="text-black text-sm">
                        {collection.count} бүтээгдэхүүн
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-black font-medium text-sm">
                    Удирдах
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
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
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
