"use client";

import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@wazo/convex-api/api";

interface FeaturedProductsProps {
  onAuthOpen: () => void;
}

export function FeaturedProducts() {
  const router = useRouter();
  // const products = useQuery(api.functions.products.getProductsInStock, {
  //   limit: 6,
  // });


  const products =useQuery(api.functions.products.getProductsInStock, {
          minPrice: 0,
          maxPrice: 10000000000,
          limit: 3,
  
        });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const generateRating = (productId: string) => {
    // Generate consistent rating based on product ID
    const hash = productId.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return 4.4 + (hash % 5) * 0.1;
  };

  const generateReviews = (productId: string) => {
    // Generate consistent review count based on product ID
    const hash = productId.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return 28 + (hash % 129);
  };

  const handleAddToCart = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="mr-2">⭐</span>
            Featured Products
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Handpicked Favorites
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the most loved products by animal lovers across Nigeria.
            Quality tested, vet approved, and animal loved!
          </p>
        </div>

        {!products ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="w-full h-64 bg-gray-200" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-6 w-2/3" />
                  <div className="h-10 bg-gray-300 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: typeof products[number], index: number) => {
              const rating = generateRating(product._id);
              const reviews = generateReviews(product._id);
              const discountPercent = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )
                : null;

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {product.badge && (
                      <div
                        className={`absolute top-4 left-4 ${
                          product.badge === "Best Seller"
                            ? "bg-green-500"
                            : product.badge === "New Arrival"
                              ? "bg-blue-500"
                              : product.badge === "Hot Deal"
                                ? "bg-red-500"
                                : "bg-purple-500"
                        } text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
                      >
                        {product.badge}
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white px-6 py-3 rounded-xl font-bold text-gray-900 shadow-xl">
                          Out of Stock
                        </div>
                      </div>
                    )}

                    {discountPercent && (
                      <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save {discountPercent}%
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2 font-medium">
                        {rating.toFixed(1)} ({reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={!product.inStock}
                      className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all transform hover:scale-105 ${
                        product.inStock
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-16">
          <button 
          onClick={()=>router.push("/products")}
          
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
