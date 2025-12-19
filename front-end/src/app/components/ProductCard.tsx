"use client";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: "Male" | "Female" | "Children" | "Accessories";
  description?: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, addToRecentlyViewed } = useUser();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    addToRecentlyViewed(product);
    showToast("Бүтээгдэхүүн сагсанд нэмэгдлээ!", "success");
  };

  const handleClick = () => {
    addToRecentlyViewed(product);
    router.push(`/product/${product.id}`);
  };

  return (
    <article className="group cursor-pointer" onClick={handleClick}>
      <div className="relative w-full aspect-square bg-gray-100 mb-3 overflow-hidden rounded-xl">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
          style={{ backgroundImage: `url(${product.imageUrl})` }}
        />
        {product.category && (
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg text-xs font-medium text-gray-700 shadow-sm">
            {product.category}
          </div>
        )}
      </div>
      <h3 className="font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors duration-300">
        {product.name}
      </h3>
      <p className="text-gray-600 mb-3">${product.price.toFixed(2)}</p>
      <button
        onClick={handleAddToCart}
        className="w-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 ease-in-out rounded-lg"
      >
        Add to Cart
      </button>
    </article>
  );
}
