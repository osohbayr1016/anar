"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./SkeletonLoading";
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

type CollectionPageProps = {
  category: "Male" | "Female" | "Children";
  title: string;
  description: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function CollectionPage({
  category,
  title,
  description,
}: CollectionPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then((data) => {
        const filtered = data.filter((p: Product) => p.category === category);
        setProducts(filtered);
        setFilteredProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [products, priceRange, selectedColors, sortBy]);

  const applyFilters = () => {
    let filtered = [...products];

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors?.some((c) => selectedColors.includes(c.color))
      );
    }

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
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-black mb-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Нүүр
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/products"
              className="hover:text-gray-600 transition-colors"
            >
              Бүтээгдэхүүн
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">
              {category === "Male"
                ? "Эрэгтэй"
                : category === "Female"
                ? "Эмэгтэй"
                : "Хүүхэд"}
            </span>
          </nav>
          <h1 className="text-5xl font-bold mb-4 text-black">{title}</h1>
          <p className="text-black text-lg">{description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4 text-black">Шүүлтүүр</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">
                  Эрэмбэлэх
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="default">Үндсэн</option>
                  <option value="price-asc">Үнэ: Багаас их</option>
                  <option value="price-desc">Үнэ: Ихээс бага</option>
                  <option value="name">Нэрээр</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">
                  Үнэ: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-black"
                />
              </div>

              {allColors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-black">
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
                          className="rounded accent-black"
                        />
                        <span className="text-sm text-black">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <ProductGridSkeleton count={9} />
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-black">
                    {filteredProducts.length} бүтээгдэхүүн олдлоо
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Бүтээгдэхүүн олдсонгүй
                </h3>
                <p className="text-black mb-6">
                  Шүүлтүүрээ өөрчлөөд дахин оролдоно уу
                </p>
                <button
                  onClick={() => {
                    setPriceRange([0, 1000]);
                    setSelectedColors([]);
                    setSortBy("default");
                  }}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Шүүлтүүр цэвэрлэх
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
