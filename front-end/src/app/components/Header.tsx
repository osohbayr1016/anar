"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useToast } from "../context/ToastContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { cart } = useUser();
  const router = useRouter();
  const { showToast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    showToast("Амжилттай гарлаа", "success");
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target as Node)
      ) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-black flex-shrink-0">
            ANAR SHOP
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center mx-8">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors border-b-2 border-transparent hover:border-black"
            >
              Latest Drops
            </Link>
            
            {/* Shop Dropdown */}
            <div className="relative" ref={shopDropdownRef}>
              <button
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors flex items-center space-x-1 border-b-2 border-transparent hover:border-black"
              >
                <span>Shop</span>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    shopDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Shop Dropdown Menu */}
              {shopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-gray-200 shadow-lg py-6 px-8">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Apparel Column */}
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-4">
                        Apparel
                      </h3>
                      <ul className="space-y-3">
                        <li>
                          <Link
                            href="/products"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            Best Sellers
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/collections/male"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            Male
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/collections/female"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            Female
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/collections/children"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            Kids
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/products"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            All
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Accessories Column */}
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-4">
                        Collections
                      </h3>
                      <ul className="space-y-3">
                        <li>
                          <Link
                            href="/collections/male"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            Male Collection
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/collections/female"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            Female Collection
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/collections/children"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            Children Collection
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* All Products */}
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-4">
                        View All
                      </h3>
                      <ul className="space-y-3">
                        <li>
                          <Link
                            href="/products"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            All Products
                          </Link>
                        </li>
                        {user && user.role === "admin" && (
                          <li>
                            <Link
                              href="/admin"
                              onClick={() => setShopDropdownOpen(false)}
                              className="text-sm text-gray-600 hover:text-black transition-colors"
                            >
                              Admin
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/sale"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors border-b-2 border-transparent hover:border-black"
            >
              Sale
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors border-b-2 border-transparent hover:border-black"
            >
              About
            </Link>
            <Link
              href="/reviews"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors border-b-2 border-transparent hover:border-black"
            >
              Reviews
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center justify-center space-x-4 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-700 hover:text-black p-2 flex items-center justify-center"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* User Account */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 hover:text-black p-2 flex items-center justify-center"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-gray-700 hover:text-black p-2 flex items-center justify-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link href="/profile" className="text-gray-700 hover:text-black relative p-2 flex items-center justify-center">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="hidden md:block py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-r-lg hover:bg-gray-800"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-700"
              >
                Latest Drops
              </Link>
              <div>
                <button
                  onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                  className="text-sm font-medium text-gray-700 flex items-center space-x-1"
                >
                  <span>Shop</span>
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      shopDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {shopDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <Link
                      href="/collections/male"
                      onClick={() => {
                        setShopDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600"
                    >
                      Male
                    </Link>
                    <Link
                      href="/collections/female"
                      onClick={() => {
                        setShopDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600"
                    >
                      Female
                    </Link>
                    <Link
                      href="/collections/children"
                      onClick={() => {
                        setShopDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600"
                    >
                      Kids
                    </Link>
                    <Link
                      href="/products"
                      onClick={() => {
                        setShopDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600"
                    >
                      All Products
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/sale"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-700"
              >
                Sale
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-700"
              >
                About
              </Link>
              <Link
                href="/reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-700"
              >
                Reviews
              </Link>
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-r-lg text-sm"
                >
                  Search
                </button>
              </form>
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-700"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-sm text-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login / Sign up
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-gray-700"
              >
                Cart ({cartCount})
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
