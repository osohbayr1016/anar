"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";

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

export default function AdminAboutPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData>({
    heroTitle: "",
    heroSubtitle: "",
    storyTitle: "",
    storyParagraphs: [""],
    valuesTitle: "",
    values: [{ title: "", description: "" }],
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
  });

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
        const data = result.data;
        // Ensure arrays are properly populated
        const storyParagraphs = Array.isArray(data.storyParagraphs) && data.storyParagraphs.length > 0
          ? data.storyParagraphs
          : [""];
        
        const values = Array.isArray(data.values) && data.values.length > 0
          ? data.values
          : [{ title: "", description: "" }];

        setAboutData({
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          storyTitle: data.storyTitle || "",
          storyParagraphs: storyParagraphs,
          valuesTitle: data.valuesTitle || "",
          values: values,
          contactTitle: data.contactTitle || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          contactAddress: data.contactAddress || "",
        });
      } else {
        showToast("Мэдээлэл олдсонгүй", "error");
      }
    } catch (error) {
      console.error("Error fetching about:", error);
      const errorMessage = error instanceof Error ? error.message : "Мэдээлэл авахад алдаа гарлаа";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      // Filter out empty paragraphs and values before saving
      const dataToSave = {
        ...aboutData,
        storyParagraphs: aboutData.storyParagraphs.filter(p => p.trim() !== ""),
        values: aboutData.values.filter(v => v.title.trim() !== "" || v.description.trim() !== ""),
      };

      // Ensure at least one paragraph and one value exists
      if (dataToSave.storyParagraphs.length === 0) {
        dataToSave.storyParagraphs = [""];
      }
      if (dataToSave.values.length === 0) {
        dataToSave.values = [{ title: "", description: "" }];
      }

      const response = await fetch(`${API_BASE}/api/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });

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
      if (result.success) {
        showToast("Амжилттай хадгаллаа", "success");
        // Refresh data after save
        await fetchAbout();
      } else {
        showToast(result.message || "Хадгалахад алдаа гарлаа", "error");
      }
    } catch (error) {
      console.error("Error saving about:", error);
      const errorMessage = error instanceof Error ? error.message : "Хадгалахад алдаа гарлаа";
      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const addParagraph = () => {
    setAboutData({
      ...aboutData,
      storyParagraphs: [...aboutData.storyParagraphs, ""],
    });
  };

  const removeParagraph = (index: number) => {
    setAboutData({
      ...aboutData,
      storyParagraphs: aboutData.storyParagraphs.filter((_, i) => i !== index),
    });
  };

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...aboutData.storyParagraphs];
    newParagraphs[index] = value;
    setAboutData({ ...aboutData, storyParagraphs: newParagraphs });
  };

  const addValue = () => {
    setAboutData({
      ...aboutData,
      values: [...aboutData.values, { title: "", description: "" }],
    });
  };

  const removeValue = (index: number) => {
    setAboutData({
      ...aboutData,
      values: aboutData.values.filter((_, i) => i !== index),
    });
  };

  const updateValue = (index: number, field: "title" | "description", value: string) => {
    const newValues = [...aboutData.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setAboutData({ ...aboutData, values: newValues });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-black">Ачааллаж байна...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 lg:min-h-screen lg:sticky lg:top-16">
          <div className="p-4 lg:p-6">
            <h2 className="text-xl font-bold text-black mb-4 lg:mb-6">Админ самбар</h2>
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-2">
              <Link
                href="/admin/male"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap lg:w-full"
              >
                <span className="text-xl">👔</span>
                <span className="text-black font-medium">Эрэгтэй</span>
              </Link>
              <Link
                href="/admin/female"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap lg:w-full"
              >
                <span className="text-xl">👗</span>
                <span className="text-black font-medium">Эмэгтэй</span>
              </Link>
              <Link
                href="/admin/children"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap lg:w-full"
              >
                <span className="text-xl">🎒</span>
                <span className="text-black font-medium">Хүүхэд</span>
              </Link>
              <Link
                href="/admin/about"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-100 text-black font-medium whitespace-nowrap lg:w-full"
              >
                <span className="text-xl">ℹ️</span>
                <span className="text-black font-medium">Бидний тухай</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap lg:w-full"
              >
                <span className="text-xl">📦</span>
                <span className="text-black font-medium">Захиалга</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap lg:w-full"
              >
                <span className="text-xl">👥</span>
                <span className="text-black font-medium">Хэрэглэгч</span>
              </Link>
              <Link
                href="/admin/support"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap lg:w-full"
              >
                <span className="text-xl">💬</span>
                <span className="text-black font-medium">Дэмжлэг</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap lg:w-full"
              >
                <span className="text-xl">🏷️</span>
                <span className="text-black font-medium">Ангилал</span>
              </Link>
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap lg:w-full"
              >
                <span className="text-xl">🏠</span>
                <span className="text-black font-medium">Дэлгүүр</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">
                  Бидний тухай хуудас удирдах
                </h1>
                <p className="text-black">About хуудсанд харагдах агуулгыг засах</p>
              </div>
              <Link
                href="/about"
                target="_blank"
                className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 text-sm font-medium"
              >
                👁️ Preview
              </Link>
            </div>

            <div className="space-y-6">
              {/* Hero Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-black mb-4">Hero хэсэг</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Гарчиг
                    </label>
                    <input
                      type="text"
                      value={aboutData.heroTitle}
                      onChange={(e) =>
                        setAboutData({ ...aboutData, heroTitle: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                      placeholder="Гарчиг"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Дэд гарчиг
                    </label>
                    <input
                      type="text"
                      value={aboutData.heroSubtitle}
                      onChange={(e) =>
                        setAboutData({
                          ...aboutData,
                          heroSubtitle: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                      placeholder="Дэд гарчиг"
                    />
                  </div>
                </div>
              </div>

              {/* Story Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-black mb-4">Түүх хэсэг</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Гарчиг
                    </label>
                    <input
                      type="text"
                      value={aboutData.storyTitle}
                      onChange={(e) =>
                        setAboutData({ ...aboutData, storyTitle: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                      placeholder="Гарчиг"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Догол мөрүүд
                    </label>
                    {aboutData.storyParagraphs.map((para, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <textarea
                          value={para}
                          onChange={(e) => updateParagraph(index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black"
                          rows={3}
                          placeholder="Догол мөр"
                        />
                        {aboutData.storyParagraphs.length > 1 && (
                          <button
                            onClick={() => removeParagraph(index)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addParagraph}
                      className="mt-2 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                    >
                      + Догол мөр нэмэх
                    </button>
                  </div>
                </div>
              </div>

              {/* Values Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-black mb-4">Үнэт зүйлс</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Гарчиг
                    </label>
                    <input
                      type="text"
                      value={aboutData.valuesTitle}
                      onChange={(e) =>
                        setAboutData({ ...aboutData, valuesTitle: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                      placeholder="Гарчиг"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Үнэт зүйлс
                    </label>
                    {aboutData.values.map((value, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-black font-medium">
                            Үнэт зүйл #{index + 1}
                          </span>
                          {aboutData.values.length > 1 && (
                            <button
                              onClick={() => removeValue(index)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                              Устгах
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={value.title}
                            onChange={(e) =>
                              updateValue(index, "title", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                            placeholder="Гарчиг"
                          />
                          <textarea
                            value={value.description}
                            onChange={(e) =>
                              updateValue(index, "description", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                            rows={2}
                            placeholder="Тайлбар"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addValue}
                      className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                    >
                      + Үнэт зүйл нэмэх
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-black mb-4">Холбоо барих</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Гарчиг
                    </label>
                    <input
                      type="text"
                      value={aboutData.contactTitle}
                      onChange={(e) =>
                        setAboutData({ ...aboutData, contactTitle: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                      placeholder="Гарчиг"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Имэйл
                    </label>
                    <input
                      type="email"
                      value={aboutData.contactEmail}
                      onChange={(e) =>
                        setAboutData({ ...aboutData, contactEmail: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                      placeholder="Имэйл"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Утас
                    </label>
                    <input
                      type="text"
                      value={aboutData.contactPhone}
                      onChange={(e) =>
                        setAboutData({ ...aboutData, contactPhone: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                      placeholder="Утас"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">
                      Хаяг
                    </label>
                    <input
                      type="text"
                      value={aboutData.contactAddress}
                      onChange={(e) =>
                        setAboutData({
                          ...aboutData,
                          contactAddress: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                      placeholder="Хаяг"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-4">
                <Link
                  href="/about"
                  className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                >
                  Цуцлах
                </Link>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Хадгалж байна..." : "Хадгалах"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

