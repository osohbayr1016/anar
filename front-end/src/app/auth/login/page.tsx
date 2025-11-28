"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      showToast("Амжилттай нэвтэрлээ", "success");
      router.push("/");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Нэвтрэх үед алдаа гарлаа",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-gray-900">
            Дахин тавтай морил
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
            Дансааа нэвтрэнэ үү
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Имэйл хаяг
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Имэйл хаягаа оруулна уу"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Нууц үг
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Нууц үгээ оруулна уу"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/auth/forgot-password"
              className="block text-sm text-gray-600 hover:text-black"
            >
              Нууц үгээ мартсан уу?
            </Link>
            <p className="text-sm text-gray-600">
              Бүртгэлгүй юу?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-black hover:underline"
              >
                Бүртгүүлэх
              </Link>
            </p>
            <Link
              href="/"
              className="block text-sm text-gray-600 hover:text-black underline"
            >
              Дэлгүүр рүү буцах
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
