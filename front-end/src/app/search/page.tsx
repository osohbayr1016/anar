"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { ProductGridSkeleton } from "../components/SkeletonLoading";
import Link from "next/link";

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, query, priceRange, selectedColors, sortBy]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors?.some((c) => selectedColors.includes(c.color))
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  };

  const allColors = Array.from(
    new Set(products.flatMap((p) => p.colors?.map((c) => c.color) || []))
  );

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 overflow-x-auto">
            <Link href="/" className="hover:text-black">
              Нүүр
            </Link>
            <span>/</span>
            <span className="text-black font-medium">Хайлтын үр дүн</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Хайлтын үр дүн: &quot;{query}&quot;
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} бүтээгдэхүүн олдлоо
              </p>
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Шүүлт
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div
              className={`lg:col-span-1 ${
                showMobileFilters ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:sticky lg:top-4">
                <h3 className="font-bold text-lg mb-4">Шүүлтүүр</h3>

                {/* Sort */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Эрэмбэлэх
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="default">Үндсэн</option>
                    <option value="price-asc">Үнэ: Багаас их рүү</option>
                    <option value="price-desc">Үнэ: Ихээс бага руу</option>
                    <option value="name">Нэрээр</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Үнийн хязгаар: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                    className="w-full"
                  />
                </div>

                {/* Colors */}
                {allColors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Өнгө
                    </label>
                    <div className="space-y-2">
                      {allColors.map((color) => (
                        <label
                          key={color}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(color)}
                            onChange={() => toggleColor(color)}
                            className="rounded"
                          />
                          <span className="text-sm">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <ProductGridSkeleton count={9} />
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredProducts
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      filteredProducts.length / itemsPerPage
                    )}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">
                    Бүтээгдэхүүн олдсонгүй
                  </h3>
                  <p className="text-gray-600 mb-4">
                    &quot;{query}&quot; гэсэн хайлтаар бүтээгдэхүүн олдсонгүй
                  </p>
                  <Link
                    href="/products"
                    className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                  >
                    Бүх бүтээгдэхүүн үзэх
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
