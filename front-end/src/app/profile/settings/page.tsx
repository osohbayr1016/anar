"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Link from "next/link";

type Address = {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
};

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Гэрийн хаяг",
      phone: "+976 9999 9999",
      street: "1-р хороо, 5-р байр",
      city: "Улаанбаатар",
      zipCode: "14200",
      isDefault: true,
    },
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAddress) {
      setAddresses(
        addresses.map((a) =>
          a.id === editingAddress.id
            ? { ...addressForm, id: a.id, isDefault: a.isDefault }
            : a
        )
      );
      showToast("Хаяг шинэчлэгдлээ", "success");
    } else {
      const newAddress: Address = {
        ...addressForm,
        id: Date.now().toString(),
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
      showToast("Хаяг нэмэгдлээ", "success");
    }

    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressForm({ name: "", phone: "", street: "", city: "", zipCode: "" });
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    showToast("Хаяг устгагдлаа", "success");
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    showToast("Үндсэн хаяг солигдлоо", "success");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("Нууц үг таарахгүй байна", "error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast("Нууц үг 6-аас олон тэмдэгт байх ёстой", "error");
      return;
    }

    // In real app, would call API here
    showToast("Нууц үг амжилттай солигдлоо", "success");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-black">
              Нүүр
            </Link>
            <span>/</span>
            <Link href="/profile" className="hover:text-black">
              Профайл
            </Link>
            <span>/</span>
            <span className="text-black font-medium">Тохиргоо</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
            Тохиргоо
          </h1>

          {/* Address Management */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Хүргэлтийн хаяг</h2>
              <button
                onClick={() => {
                  setShowAddressForm(true);
                  setEditingAddress(null);
                  setAddressForm({
                    name: "",
                    phone: "",
                    street: "",
                    city: "",
                    zipCode: "",
                  });
                }}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto"
              >
                + Хаяг нэмэх
              </button>
            </div>

            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border-2 border-gray-200 rounded-lg p-4 relative"
                >
                  {address.isDefault && (
                    <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      Үндсэн
                    </span>
                  )}
                  <h3 className="font-semibold text-lg mb-2">{address.name}</h3>
                  <p className="text-gray-600">{address.phone}</p>
                  <p className="text-gray-600">{address.street}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.zipCode}
                  </p>
                  <div className="flex gap-2 mt-4">
                    {!address.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(address.id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Үндсэн болгох
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setAddressForm({
                          name: address.name,
                          phone: address.phone,
                          street: address.street,
                          city: address.city,
                          zipCode: address.zipCode,
                        });
                        setShowAddressForm(true);
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Засах
                    </button>
                    <button
                      onClick={() => deleteAddress(address.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showAddressForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-xl max-w-md w-full my-8 p-4 sm:p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {editingAddress ? "Хаяг засах" : "Шинэ хаяг нэмэх"}
                  </h3>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Нэр
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.name}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Утас
                      </label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Гудамж, байр
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.street}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            street: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Хот
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Зип код
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.zipCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            zipCode: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                      >
                        Хадгалах
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Болих
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Нууц үг солих
            </h2>
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4 max-w-md"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Одоогийн нууц үг
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Шинэ нууц үг
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Нууц үг баталгаажуулах
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
              >
                Нууц үг солих
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
