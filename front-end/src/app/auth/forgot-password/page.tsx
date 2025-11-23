"use client";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/app/context/ToastContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setEmailSent(true);
      showToast("Нууц үг сэргээх холбоос илгээгдлээ", "success");
      setLoading(false);
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Имэйл илгээгдлээ!</h2>
            <p className="text-gray-600 mb-6">
              Нууц үг сэргээх заавар{" "}
              <span className="font-semibold">{email}</span> хаяг руу
              илгээгдлээ. Имэйлээ шалгана уу.
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Нэвтрэх хуудас руу буцах
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <Link href="/" className="flex justify-center mb-6">
            <span className="text-2xl sm:text-3xl font-bold">ANAR SHOP</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-gray-900">
            Нууц үг сэргээх
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
            Бүртгэлтэй имэйл хаягаа оруулна уу
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Илгээж байна..." : "Сэргээх холбоос илгээх"}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/auth/login"
              className="block text-sm text-gray-600 hover:text-black"
            >
              ← Нэвтрэх хуудас руу буцах
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
          </div>
        </form>
      </div>
    </div>
  );
}
