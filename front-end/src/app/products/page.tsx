"use client";
import Link from "next/link";
import Header from "../components/Header";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const collections = [
    {
      name: "Эрэгтэй",
      href: "/collections/male",
      description: "Эрэгтэйчүүдийн хувцаслалтын цуглуулга",
    },
    {
      name: "Эмэгтэй",
      href: "/collections/female",
      description: "Эмэгтэйчүүдийн гоё сайхан хувцаслалт",
    },
    {
      name: "Хүүхэд",
      href: "/collections/children",
      description: "Хүүхдийн тав тухтай хувцас",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-black">
              Манай цуглуулгууд
            </h1>
            <p className="text-black text-base sm:text-lg">
              Бүтээгдэхүүн үзэхийн тулд ангилал сонгоно уу
            </p>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.name}
                href={collection.href}
                className="group flex"
              >
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full flex flex-col">
                  <div className="w-full h-64 bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300 flex-shrink-0" />
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold mb-2 text-black group-hover:text-gray-600 transition-colors">
                      {collection.name}
                    </h2>
                    <p className="text-black mb-4 flex-grow">
                      {collection.description}
                    </p>
                    <div className="flex items-center text-black font-medium mt-auto">
                      Одоо худалдаж авах
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
