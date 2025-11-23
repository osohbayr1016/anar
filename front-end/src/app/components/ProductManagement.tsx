"use client";
import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "./ConfirmModal";

type ColorStock = {
  color: string;
  quantity: number;
};

type SizeStock = {
  size: string;
  quantity: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: "Male" | "Female" | "Children";
  description?: string;
  colors?: ColorStock[];
  sizes?: SizeStock[];
  totalStock?: number;
};

type ProductManagementProps = {
  category: "Male" | "Female" | "Children";
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function ProductManagement({
  category,
}: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id: string;
  }>({ show: false, id: "" });
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data.filter((p: Product) => p.category === category));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
      showToast("Бүтээгдэхүүн амжилттай устгагдлаа", "success");
      setDeleteConfirm({ show: false, id: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Бүтээгдэхүүн устгахад алдаа гарлаа", "error");
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="text-center py-12 text-black">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-black">
          {category} Products ({products.length})
        </h2>
        <button
          onClick={startCreate}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Product
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Colors/Sizes
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded mr-3 overflow-hidden">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-black">{product.name}</p>
                      <p className="text-sm text-black line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-black">${product.price}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {product.totalStock || 0} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.colors.slice(0, 2).map((c, i) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            {c.color}: {c.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                          >
                            {s.size}: {s.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="text-black hover:text-gray-600 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({ show: true, id: product.id })
                    }
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Products Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate text-black">{product.name}</h3>
                <p className="text-sm text-black line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-bold mt-1 text-black">${product.price}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                {product.totalStock || 0} units
              </span>
              <div className="flex flex-wrap gap-1">
                {product.colors?.slice(0, 2).map((c, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {c.color}
                  </span>
                ))}
                {product.sizes?.slice(0, 2).map((s, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    {s.size}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(product)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirm({ show: true, id: product.id })}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          category={category}
          onClose={closeForm}
          onSuccess={() => {
            closeForm();
            fetchProducts();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Бүтээгдэхүүн устгах"
        message="Энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?"
        onConfirm={() => deleteProduct(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm({ show: false, id: "" })}
        confirmText="Устгах"
        cancelText="Болих"
        variant="danger"
      />
    </div>
  );
}

// Product Form Modal Component (inline to keep under 160 lines per file rule)
function ProductFormModal({
  product,
  category,
  onClose,
  onSuccess,
}: {
  product: Product | null;
  category: "Male" | "Female" | "Children";
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    description: product?.description || "",
    imageUrl: product?.imageUrl || "",
  });
  const [priceInput, setPriceInput] = useState<string>(
    product?.price ? product.price.toString() : ""
  );
  const [colors, setColors] = useState<ColorStock[]>(
    product?.colors || [{ color: "", quantity: 0 }]
  );
  const [sizes, setSizes] = useState<SizeStock[]>(
    product?.sizes || []
  );
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Update priceInput when product changes
  useEffect(() => {
    if (product?.price) {
      const rounded = Math.round(product.price * 100) / 100;
      setPriceInput(rounded.toString());
    } else {
      setPriceInput("");
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate image
    if (!formData.imageUrl) {
      showToast("Зураг оруулах шаардлагатай", "error");
      return;
    }

    const colorStock = colors.reduce((sum, c) => sum + c.quantity, 0);
    const sizeStock = sizes.reduce((sum, s) => sum + s.quantity, 0);
    const totalStock = colorStock + sizeStock;
    
    // Round price to 2 decimal places to avoid floating point errors
    const roundedPrice = Math.round(formData.price * 100) / 100;
    
    const productData = {
      ...formData,
      category,
      colors: colors.filter(c => c.color && c.quantity > 0),
      sizes: sizes.filter(s => s.quantity > 0),
      totalStock,
      price: roundedPrice,
    };

    try {
      const url = product
        ? `${API_BASE}/api/products/${product.id}`
        : `${API_BASE}/api/products`;
      const method = product ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      showToast(
        product ? "Бүтээгдэхүүн шинэчлэгдлээ" : "Бүтээгдэхүүн нэмэгдлээ",
        "success"
      );
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      showToast("Алдаа гарлаа", "error");
    }
  };

  const addColor = () => {
    setColors([...colors, { color: "", quantity: 0 }]);
  };

  const updateColor = (
    index: number,
    field: keyof ColorStock,
    value: string | number
  ) => {
    const newColors = [...colors];
    if (field === "quantity") {
      const numValue = value === "" ? 0 : Number(value);
      newColors[index] = { ...newColors[index], [field]: numValue >= 0 ? numValue : 0 };
    } else {
      newColors[index] = { ...newColors[index], [field]: value };
    }
    setColors(newColors);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };
  
  const toggleSize = (size: string) => {
    const existing = sizes.find(s => s.size === size);
    if (existing) {
      setSizes(sizes.filter(s => s.size !== size));
    } else {
      setSizes([...sizes, { size, quantity: 0 }]);
    }
  };
  
  const updateSizeQuantity = (size: string, quantity: number | string) => {
    const numValue = quantity === "" ? 0 : Number(quantity);
    setSizes(sizes.map(s => s.size === size ? { ...s, quantity: numValue >= 0 ? numValue : 0 } : s));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
    setImageFile(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast("Зөвхөн зураг файл оруулна уу", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Зургийн хэмжээ 5MB-аас их байна", "error");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData({ ...formData, imageUrl: base64String });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full my-8 p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-black">
          {product ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн нэмэх"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Бүтээгдэхүүний нэр *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-black placeholder:opacity-60 text-black"
                placeholder="жишээ: Men's Cotton T-Shirt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Үнэ ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={priceInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setPriceInput(value);
                  if (value === "") {
                    setFormData({ ...formData, price: 0 });
                  } else {
                    // Parse and round to 2 decimal places to avoid floating point errors
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                      const rounded = Math.round(numValue * 100) / 100;
                      setFormData({ ...formData, price: rounded });
                    }
                  }
                }}
                onBlur={(e) => {
                  // Format on blur to ensure proper display
                  const value = e.target.value;
                  if (value !== "") {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                      const rounded = Math.round(numValue * 100) / 100;
                      setPriceInput(rounded.toString());
                      setFormData({ ...formData, price: rounded });
                    }
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-black placeholder:opacity-60 text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Зураг *
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-black mb-2">Файл upload хийх:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-black">ЭСВЭЛ</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-black mb-2">URL оруулах:</label>
                <input
                  type="url"
                  value={imageFile ? "" : formData.imageUrl}
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-black placeholder:opacity-60 text-black"
                  placeholder="https://example.com/image.jpg"
                  disabled={!!imageFile}
                />
              </div>
            </div>
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-black mb-2">Урьдчилан үзэх:</p>
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImagePreview("");
                      setImageFile(null);
                      showToast("Зургийг ачаалахад алдаа гарлаа", "error");
                    }}
                  />
                </div>
                {imageFile && (
                  <p className="text-xs text-black mt-2">
                    Файл: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Тайлбар
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-black placeholder:opacity-60 text-black"
              rows={3}
              placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Өнгө болон нөөц
              </label>
              <div className="space-y-2">
                {colors.map((color, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Өнгө (жишээ: Black)"
                      value={color.color}
                      onChange={(e) => updateColor(index, "color", e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-black placeholder:opacity-60 text-black"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Тоо"
                      value={color.quantity === 0 ? "" : color.quantity}
                      onChange={(e) =>
                        updateColor(index, "quantity", e.target.value)
                      }
                      className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-black placeholder:opacity-60 text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addColor}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Өнгө нэмэх
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Хэмжээ болон нөөц
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        sizes.some(s => s.size === size)
                          ? "bg-black text-white"
                          : "bg-gray-200 text-black hover:bg-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-12 text-sm font-medium text-black">{size.size}:</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Тоо"
                      value={size.quantity === 0 ? "" : size.quantity}
                      onChange={(e) =>
                        updateSizeQuantity(size.size, e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-black placeholder:opacity-60 text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors"
            >
              {product ? "Шинэчлэх" : "Үүсгэх"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Болих
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
