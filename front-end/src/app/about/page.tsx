"use client";
import Link from "next/link";
import Header from "../components/Header";

export const dynamic = "force-dynamic";

export default function AboutPage() {
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
              Бидний тухай
            </h1>
            <p className="text-xl text-black">
              Монголд бүтээгдсэн. Дэлхий даяар өмсөгддөг.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Story Section */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">
                Манай түүх
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-black leading-relaxed mb-4">
                  Anar Shop бол загварын сонирхолтой хүмүүсийн бүтээл юм. Бид
                  чанартай, орчин үеийн хувцас, хэрэглэлүүдийг Монголын
                  хэрэглэгчдэд хүргэх зорилготой.
                </p>
                <p className="text-black leading-relaxed mb-4">
                  Манай бүтээгдэхүүнүүд нь хамгийн сайн чанартай материал,
                  анхааралтай хийгдсэн дизайн, байгаль орчинд ээлтэй үйлдвэрлэл
                  зэргээр онцлогтой.
                </p>
                <p className="text-black leading-relaxed">
                  Бид зөвхөн хувцас борлуулахгүй, харин таны амьдралын хэв
                  маягийг илэрхийлэх арга замыг санал болгодог.
                </p>
              </div>
            </section>

            {/* Values Section */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">
                Манай үнэт зүйлс
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
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
                  <h3 className="font-bold text-lg mb-2 text-black">Чанар</h3>
                  <p className="text-black text-sm">
                    Бид зөвхөн хамгийн сайн чанартай бүтээгдэхүүн санал болгодог
                  </p>
                </div>
                <div className="text-center">
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-black">Хэрэглэгч</h3>
                  <p className="text-black text-sm">
                    Таны сэтгэл ханамж бидний тэргүүн зорилго
                  </p>
                </div>
                <div className="text-center">
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
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-black">Байгаль орчин</h3>
                  <p className="text-black text-sm">
                    Байгаль орчинд ээлтэй үйлдвэрлэл, бүтээгдэхүүн
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">
                Холбоо барих
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-black">Имэйл</h3>
                  <a
                    href="mailto:info@anarshop.mn"
                    className="text-black hover:text-gray-600"
                  >
                    info@anarshop.mn
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-black">Утас</h3>
                  <a
                    href="tel:+97612345678"
                    className="text-black hover:text-gray-600"
                  >
                    +976 1234 5678
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-black">Хаяг</h3>
                  <p className="text-black">
                    Улаанбаатар хот, Сүхбаатар дүүрэг
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


