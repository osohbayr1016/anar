"use client";
import Link from "next/link";

export default function CategorySection() {
  const categories = [
    { name: "Male", color: "from-blue-100 to-blue-200", href: "/collections/male" },
    { name: "Female", color: "from-pink-100 to-pink-200", href: "/collections/female" },
    { name: "Children", color: "from-yellow-100 to-yellow-200", href: "/collections/children" },
  ];

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-semibold mb-6">Shop by category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className="text-center group cursor-pointer"
          >
            <div
              className={`w-full aspect-square bg-gradient-to-br ${c.color} rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300`}
            />
            <p className="font-medium text-lg group-hover:text-gray-600 transition-colors">
              {c.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
