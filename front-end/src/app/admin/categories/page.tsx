"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import ConfirmModal from "@/app/components/ConfirmModal";
import Link from "next/link";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  colorGradient: string;
  icon: string;
  isActive: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function AdminCategoriesPage() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: "" });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    colorGradient: "from-blue-100 to-blue-200",
    icon: "📦",
  });

  const gradientOptions = [
    "from-blue-100 to-blue-200",
    "from-pink-100 to-pink-200",
    "from-yellow-100 to-yellow-200",
    "from-green-100 to-green-200",
    "from-purple-100 to-purple-200",
    "from-red-100 to-red-200",
  ];

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? `${API_BASE}/api/categories/${editingCategory._id}`
        : `${API_BASE}/api/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          editingCategory ? "Category шинэчлэгдлээ" : "Category нэмэгдлээ",
          "success"
        );
        setShowForm(false);
        setEditingCategory(null);
        setFormData({
          name: "",
          description: "",
          colorGradient: "from-blue-100 to-blue-200",
          icon: "📦",
        });
        fetchCategories();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("Алдаа гарлаа", "error");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        showToast("Category устгагдлаа", "success");
        setDeleteConfirm({ show: false, id: "" });
        fetchCategories();
      }
    } catch (error) {
      showToast("Алдаа гарлаа", "error");
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      colorGradient: category.colorGradient,
      icon: category.icon,
    });
    setShowForm(true);
  };

  if (!user || user.role !== "admin") return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
            >
              ← Back to Dashboard
            </Link>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-2xl">
                🏷️
              </div>
              <div>
                <h1 className="text-3xl font-bold">Categories Management</h1>
                <p className="text-gray-600">
                  Create and manage product categories
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingCategory(null);
                setFormData({
                  name: "",
                  description: "",
                  colorGradient: "from-blue-100 to-blue-200",
                  icon: "📦",
                });
              }}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              + Add Category
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div
                    className={`h-32 bg-gradient-to-br ${category.colorGradient} flex items-center justify-center text-6xl`}
                  >
                    {category.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({ show: true, id: category._id })
                        }
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-xl max-w-md w-full my-8 p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="e.g., Male, Female, Kids"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Color Gradient
                    </label>
                    <select
                      value={formData.colorGradient}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          colorGradient: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {gradientOptions.map((gradient) => (
                        <option key={gradient} value={gradient}>
                          {gradient}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="📦"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                    >
                      {editingCategory ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingCategory(null);
                      }}
                      className="flex-1 bg-gray-200 py-3 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <ConfirmModal
            isOpen={deleteConfirm.show}
            title="Delete Category"
            message="Are you sure you want to delete this category?"
            onConfirm={() => deleteCategory(deleteConfirm.id)}
            onCancel={() => setDeleteConfirm({ show: false, id: "" })}
            variant="danger"
          />
        </div>
      </main>
    </>
  );
}


