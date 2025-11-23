"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Link from "next/link";

type Ticket = {
  _id: string;
  userEmail: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function AdminSupportPage() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tickets/admin/all`, {
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

  const updateTicket = async (
    ticketId: string,
    status: string,
    priority: string
  ) => {
    try {
      const res = await fetch(`${API_BASE}/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, priority }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Статус шинэчлэгдлээ", "success");
        fetchTickets();
      }
    } catch (error) {
      showToast("Алдаа гарлаа", "error");
    }
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
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-gray-600">Manage customer support requests</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {ticket.subject}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {ticket.userEmail}
                      </p>
                      <p className="text-gray-700">{ticket.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          updateTicket(
                            ticket._id,
                            e.target.value,
                            ticket.priority
                          )
                        }
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="open">Нээлттэй</option>
                        <option value="in-progress">Шийдвэрлэж байна</option>
                        <option value="resolved">Шийдэгдсэн</option>
                        <option value="closed">Хаагдсан</option>
                      </select>
                      <select
                        value={ticket.priority}
                        onChange={(e) =>
                          updateTicket(
                            ticket._id,
                            ticket.status,
                            e.target.value
                          )
                        }
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="low">Бага</option>
                        <option value="medium">Дунд</option>
                        <option value="high">Өндөр</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}


