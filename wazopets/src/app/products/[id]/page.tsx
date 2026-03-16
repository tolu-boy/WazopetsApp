"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@wazo/convex-api/api";
import { Id } from "@wazo/convex-api/dataModel";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useUser();

  // ✅ 1. Fetch product by Convex ID
  const product = useQuery(api.functions.products.getProductById, {
    productId: id as Id<"products">,
  });

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const addToCartMut = useMutation(api.functions.cart.addToCart);

  const [selectedImage, setSelectedImage] = useState<string>("");

  // ✅ Wait for product to load
  useEffect(() => {
    if (product && product?.imageUrls && product.imageUrls.length > 0) {
      setSelectedImage(product.imageUrls[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product details... 🐾
      </div>
    );
  }

  // ✅ Add to cart logic
  const handleAddToCart = async () => {
    if (!product) return;

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: selectedImage,
    });
    toast.success(`${product.name} added to your cart!`);
    if (user?.id) {
      try {
        await addToCartMut({
          userId: user.id,
          productId: product._id as Id<"products">,
          quantity: 1,
        });
      } catch (e) {
        console.error("Convex addToCart failed, rolling back:", e);
        removeItem(product._id);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left — Images */}
        <div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="flex gap-3">
            {product.imageUrls?.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`border-2 rounded-xl overflow-hidden w-20 h-20 ${
                  selectedImage === img
                    ? "border-green-600"
                    : "border-transparent hover:border-green-300"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right — Info */}
        <div>
          {product.badge && (
            <span className="inline-block px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full mb-3">
              {product.badge}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          {/* <p className="text-gray-500 font-medium mb-4">{product.brand}</p> */}

          {/* <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-700 font-medium">
              {product.rating ?? "4.5"} ({product.reviews ?? 0} reviews)
            </span>
          </div> */}

          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product?.description}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>

            <button className="p-3 rounded-xl border-2 border-gray-200 hover:border-red-400 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Description
        </h2>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>
    </div>
  );
}
