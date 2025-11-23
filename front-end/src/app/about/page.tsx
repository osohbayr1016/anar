"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";

export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

interface AboutData {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  valuesTitle: string;
  values: Array<{
    title: string;
    description: string;
  }>;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/about`);
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON but got:", text.substring(0, 200));
        throw new Error("Server returned non-JSON response. Is the backend server running?");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setAboutData(result.data);
      }
    } catch (error) {
      console.error("Error fetching about:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-black">Ачааллаж байна...</p>
        </main>
      </>
    );
  }

  if (!aboutData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-black">Мэдээлэл олдсонгүй</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-black mb-8">
            <Link href="/" className="hover:text-gray-600">
              Нүүр
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">Бидний тухай</span>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black">
              {aboutData.heroTitle || "Бидний тухай"}
            </h1>
            <p className="text-xl text-black">
              {aboutData.heroSubtitle || "Монголд бүтээгдсэн. Дэлхий даяар өмсөгддөг."}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Story Section */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">
                {aboutData.storyTitle || "Манай түүх"}
              </h2>
              <div className="prose prose-lg max-w-none">
                {aboutData.storyParagraphs && aboutData.storyParagraphs.length > 0 ? (
                  aboutData.storyParagraphs.map((para, index) => (
                    <p
                      key={index}
                      className="text-black leading-relaxed mb-4"
                    >
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-black leading-relaxed">
                    Anar Shop бол загварын сонирхолтой хүмүүсийн бүтээл юм.
                  </p>
                )}
              </div>
            </section>

            {/* Values Section */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">
                {aboutData.valuesTitle || "Манай үнэт зүйлс"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {aboutData.values && aboutData.values.length > 0 ? (
                  aboutData.values.map((value, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-black">
                        {value.title}
                      </h3>
                      <p className="text-black text-sm">{value.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <p className="text-black">Үнэт зүйлс оруулаагүй байна</p>
                  </div>
                )}
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">
                {aboutData.contactTitle || "Холбоо барих"}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-black">Имэйл</h3>
                  <a
                    href={`mailto:${aboutData.contactEmail || "info@anarshop.mn"}`}
                    className="text-black hover:text-gray-600"
                  >
                    {aboutData.contactEmail || "info@anarshop.mn"}
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-black">Утас</h3>
                  <a
                    href={`tel:${aboutData.contactPhone?.replace(/\s/g, "") || "+97612345678"}`}
                    className="text-black hover:text-gray-600"
                  >
                    {aboutData.contactPhone || "+976 1234 5678"}
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-black">Хаяг</h3>
                  <p className="text-black">
                    {aboutData.contactAddress || "Улаанбаатар хот, Сүхбаатар дүүрэг"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Бүтээгдэхүүн үзэх
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}


