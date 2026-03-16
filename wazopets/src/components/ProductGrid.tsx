"use client";
import { ShoppingCart, Heart, Filter, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { api } from "@wazo/convex-api/api";
import { useMutation, useQuery } from "convex/react";
import { formatPrice } from "@/lib/formatters";
import { Id } from "@wazo/convex-api/dataModel";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ProductFilter from "./ProductFilter";
interface ProductGridProps {
  category: string | null;
  // onCategoryChange: (category: string | null) => void;
  // onAuthOpen: () => void;
}
export function ProductGrid({
  category,
}: // onCategoryChange, onAuthOpen

ProductGridProps) {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] =
    useState<Id<"categories"> | null>(null); // stores category id now
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [pendingCategory, setPendingCategory] =
    useState<Id<"categories"> | null>(selectedCategory);
  const [pendingPriceRange, setPendingPriceRange] =
    useState<[number, number]>(priceRange);
  const [showFilters, setShowFilters] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTerm = searchParams.get("search") || "";

  // CALL convex backend with filters/sorts for search and products
  const productsData = searchTerm.trim()
    ? useQuery(api.functions.products.searchProducts, {
        searchTerm,
        categoryId: selectedCategory || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        limit: 20,
      })
    : useQuery(api.functions.products.getProductsInStock, {
        categoryId: selectedCategory || undefined, // just a string or undefined
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        limit: 20,
      });
  const categoriesData = useQuery(api.functions.categories.getCategories);
  const addToCartBackend = useMutation(api.functions.cart.addToCart);
  const { user } = useUser();
  // console.log(productsData, "testing product data");
  // console.log(categoriesData, "testing categories data");

  const categories = categoriesData;

  const handleAddToCart = async (product: any) => {
    if (!product.inStock) return;

    if (!user) {
      // 👤 Guest user → Local Zustand cart
      addItem({
        id: product._id,
        name: product.name,
        // brand: product.brand || "",
        price: product.price,
        image: product.image,
      });

      useCartStore.getState().setCartNeedsSync(true);
      // alert(`${product.name} added to your cart!`);
      toast.success(`${product.name} added to your cart!`);
    } else {
      // 🔐 Logged-in user → Optimistic dual-write with rollback
      // 1) Optimistic local add
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      try {
        // 2) Backend write
        await addToCartBackend({
          userId: user.id,
          productId: product._id,
          quantity: 1,
        });
        // alert(`${product.name} added to your cart!`);
        toast.success(`${product.name} added to your cart!`);
      } catch (e) {
        // 3) Rollback local on failure
        console.error("addToCart failed:", e);
        removeItem(product._id);
        alert(`Failed to add ${product.name}. Please try again.`);
      }
    }
  };

  // ✅ Reset filters when search term changes
  //  useEffect(() => {
  //   if (searchTerm.trim()) {
  //     // When searching, reset filters to defaults
  //     setSelectedCategory(null);
  //     setPendingCategory(null);
  //     setPriceRange([0, 100000]);
  //     setPendingPriceRange([0, 100000]);
  //     setSortBy("featured");
  //   }
  // }, [searchTerm]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <ProductFilter
        showFilters={showFilters}
        categories={categories || []}
        pendingCategory={pendingCategory}
        setPendingCategory={setPendingCategory}
        pendingPriceRange={pendingPriceRange}
        setPendingPriceRange={setPendingPriceRange}
        onApply={() => {
          setSelectedCategory(pendingCategory);
          setPriceRange(pendingPriceRange);
        }}
        onReset={() => {
          setSelectedCategory(null);
          setPendingCategory(null);
          setPriceRange([0, 10000000]);
          setPendingPriceRange([0, 10000000]);
          setSortBy("featured");
          router.push("/products");
        }}
      />

      {/* Products Grid */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {/* {category ? categories.find(c => c.id === category)?.name : 'All Products'} */}
              All Products
            </h1>
            <p className="text-gray-600 font-medium">
              {productsData?.length} products found
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsData?.map((product, index) => (
            //             <Link href={`/products/${product.id}`}
            //              key={product.id} >
            //             <div
            //               className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-2"
            //               style={{ animationDelay: `${index * 100}ms` }}
            //             >
            //               <div className="relative overflow-hidden">
            //                 <img
            //                   src={product.image}
            //                   alt={product.name}
            //                   className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            //                 />

            //                 {product.badge && (
            //                   <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
            //                     product.badge === 'Best Seller' ? 'bg-green-500' :
            //                     product.badge === 'New' ? 'bg-blue-500' :
            //                     product.badge === 'Sale' ? 'bg-red-500' :
            //                     product.badge === 'Premium' ? 'bg-purple-500' :
            //                     'bg-orange-500'
            //                   }`}>
            //                     {product.badge}
            //                   </div>
            //                 )}

            //                 <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            //                   <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
            //                     <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            //                   </button>
            //                   <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
            //                     <Eye className="w-4 h-4 text-gray-600" />
            //                   </button>
            //                 </div>

            //                 {!product.inStock && (
            //                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            //                     <div className="bg-white px-6 py-3 rounded-xl font-bold text-gray-900 shadow-xl">
            //                       Out of Stocks
            //                     </div>
            //                   </div>
            //                 )}

            //                 {product.originalPrice && (
            //                   <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            //                     Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            //                   </div>
            //                 )}
            //               </div>

            //               <div className="p-6">
            //                 <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight line-clamp-2 group-hover:text-green-600 transition-colors">
            //                   {product.name}
            //                 </h3>
            //                 <p className="text-sm text-gray-500 mb-3 font-medium">{product.brand}</p>

            //                 <div className="flex items-center mb-4">
            //                   <div className="flex items-center">
            //                     {[...Array(5)].map((_, i) => (
            //                       <Star
            //                         key={i}
            //                         className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            //                       />
            //                     ))}
            //                   </div>
            //                   <span className="text-sm text-gray-600 ml-2 font-medium">
            //                     {product.rating} ({product.reviews})
            //                   </span>
            //                 </div>

            //                 <div className="flex items-center justify-between mb-6">
            //                   <div className="flex items-center space-x-2">
            //                     <span className="text-2xl font-bold text-gray-900">
            //                       {formatPrice(product.price)}
            //                     </span>
            //                     {product.originalPrice && (
            //                       <span className="text-lg text-gray-500 line-through">
            //                         {formatPrice(product.originalPrice)}
            //                       </span>
            //                     )}
            //                   </div>
            //                 </div>

            //                 <button
            //                   // onClick={() => handleAddToCart(product.id)}
            //                   //  onClick={() => handleAddToCart(product)}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   e.preventDefault();
            //   handleAddToCart(product);
            // }}
            //                   disabled={!product.inStock}
            //                   className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all transform hover:scale-105 ${
            //                     product.inStock
            //                       ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
            //                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            //                   }`}
            //                 >
            //                   <ShoppingCart className="w-5 h-5" />
            //                   <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            //                 </button>
            //               </div>
            //             </div>
            //             </Link>

            <div
              key={product?._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-2"
            >
              <Link href={`/products/${product._id}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white px-6 py-3 rounded-xl font-bold text-gray-900 shadow-xl">
                        Out of Stocks
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight line-clamp-2">
                  <Link
                    href={`/products/${product._id}`}
                    className="hover:text-green-600"
                  >
                    {product.name}
                  </Link>
                </h3>

                {product.badge && (
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                      product.badge === "Best Seller"
                        ? "bg-green-500"
                        : product.badge === "New"
                          ? "bg-blue-500"
                          : product.badge === "Sale"
                            ? "bg-red-500"
                            : product.badge === "Premium"
                              ? "bg-purple-500"
                              : "bg-orange-500"
                    }`}
                  >
                    {product.badge}
                  </div>
                )}
                {/* 
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white px-6 py-3 rounded-xl font-bold text-gray-900 shadow-xl">
                      Out of Stocks
                    </div>
                  </div>
                )} */}

                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* {product.originalPrice && product.inStock && (
                 <div className="absolute top-45 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                   Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                 </div>
               )} */}

                <div className="">
                  <p className="text-sm text-gray-500 mb-3 font-medium">
                    {product.categoryName}
                  </p>
                  {/* <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2 font-medium">
                      {product.rating} ({product.reviews})
                    </span>
                  </div> */}

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
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
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
          ))}
        </div>

        {productsData?.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-gray-400 text-8xl mb-6">🐾</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No products found
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Try adjusting your filters or search terms
            </p>
            <button
              // onClick={() => onCategoryChange(null)}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
