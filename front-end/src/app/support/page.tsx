"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

type Ticket = {
  _id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

const statusLabels: Record<string, string> = {
  open: "Нээлттэй",
  "in-progress": "Шийдвэрлэж байна",
  resolved: "Шийдэгдсэн",
  closed: "Хаагдсан",
};

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

export default function SupportPage() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Таны хүсэлт илгээгдлээ!", "success");
        setFormData({ subject: "", message: "", priority: "medium" });
        setShowForm(false);
        fetchTickets();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("Хүсэлт илгээхэд алдаа гарлаа", "error");
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Тусламж & Дэмжлэг</h1>
          <p className="text-gray-600 mb-8">Асуулт, санал гомдол илгээх</p>

          <div className="mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              {showForm ? "Хаах" : "+ Шинэ хүсэлт илгээх"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Шинэ хүсэлт</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Гарчиг
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Асуудлын гарчиг..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Мэдээлэл
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    rows={6}
                    placeholder="Дэлгэрэнгүй мэдээлэл..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Яаралтай байдал
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="low">Бага</option>
                    <option value="medium">Дунд</option>
                    <option value="high">Өндөр</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                  Илгээх
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Миний хүсэлтүүд</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              </div>
            ) : tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{ticket.subject}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          statusColors[ticket.status]
                        }`}
                      >
                        {statusLabels[ticket.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {ticket.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Та хүсэлт илгээгээгүй байна
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
