"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Link from "next/link";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    city: string;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

const statusOptions = [
  {
    value: "pending",
    label: "Хүлээгдэж байна",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "confirmed",
    label: "Баталгаажсан",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "shipped",
    label: "Хүргэлтэнд гарсан",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "delivered",
    label: "Хүргэгдсэн",
    color: "bg-green-100 text-green-700",
  },
  { value: "cancelled", label: "Цуцлагдсан", color: "bg-red-100 text-red-700" },
];

export default function AdminOrdersPage() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Статус шинэчлэгдлээ", "success");
        fetchOrders();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("Алдаа гарлаа", "error");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center mb-4"
            >
              ← Back to Dashboard
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-xl sm:text-2xl">
                📦
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Захиалгууд</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Бүх захиалгыг удирдах
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Захиалга
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Хэрэглэгч
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Дүн
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Статус
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Огноо
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link
                            href={`/orders/${order._id}`}
                            className="font-semibold hover:text-blue-600"
                          >
                            {order.orderNumber}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {order.items.length} items
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium">
                            {order.shippingAddress.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.shippingAddress.city}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(order._id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                              statusOptions.find(
                                (s) => s.value === order.status
                              )?.color
                            }`}
                          >
                            {statusOptions.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-xl shadow-md p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Link
                        href={`/orders/${order._id}`}
                        className="font-bold hover:text-blue-600"
                      >
                        {order.orderNumber}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>{order.shippingAddress.name}</p>
                      <p>
                        {order.items.length} items • $
                        {order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${
                        statusOptions.find((s) => s.value === order.status)
                          ?.color
                      }`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}


