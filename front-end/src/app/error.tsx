"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black dark:text-white mb-4">
          Алдаа гарлаа!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Уучлаарай, алдаа гарсан байна. Дахин оролдоно уу эсвэл нүүр хуудас руу
          буцна уу.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Дахин оролдох
          </button>
          <Link
            href="/"
            className="border border-black dark:border-white text-black dark:text-white px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
