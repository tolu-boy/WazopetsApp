"use client";

import { useQuery } from "convex/react";
import { api } from "@wazo/convex-api/api";
import Image from "next/image";
// import ProductFilter from "@/components/ProductFilter";
import { useState } from "react";
import Link from "next/link";
import ProductFilter from "@/components/ProductFilter";

export default function AdsPage() {
  const ads = useQuery(api.functions.ads.getAllAds, { limit: 10 });
  console.log(ads, "ads");

const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
const [pendingCategory, setPendingCategory] = useState<string | null>(null);

const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
const [pendingPriceRange, setPendingPriceRange] =
  useState<[number, number]>([0, 1000000]);

const [showFilters, setShowFilters] = useState(true);
  const categoriesData = useQuery(api.functions.categories.getCategories);

  const categories = categoriesData ?? [];

  if (!ads) return <p>Loading ads...</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          All Animal Listings{" "}
          <span className="text-gray-400 text-base">({ads.length})</span>
        </h1>

        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>Most Recent</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Listings */}
        <section className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((item:any) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-56 bg-gray-100">
                <Image
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.animalType}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Category */}
                <span className="absolute top-3 left-3 rounded-full bg-blue-600/90 text-white text-xs px-3 py-1">
                  {item.animalType}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
                  {item.description || `${item.breed} for sale`}
                </h3>

                {/* Meta */}
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>🐾 {item.breed}</p>
                  <p>⏱ {item.age} years</p>
                  <p>
                    📍 {item.sellerCity}, {item.sellerState}
                  </p>
                </div>

                {/* Price */}
                <p className="mt-3 text-lg font-bold text-blue-600">
                  ₦{item.price.toLocaleString()}
                </p>

                {/* CTA */}
                {/* <button className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Contact Seller
                </button> */}

                <Link
                  href={`/browse-ads/${item._id}`}
                  className="mt-auto w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition block"
                >
                  Contact Seller
                </Link>
              </div>
            </div>
          ))}
        </section>

       <ProductFilter
  showFilters={showFilters}
  categories={categories}
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
    setPriceRange([0, 1000000]);
    setPendingPriceRange([0, 1000000]);
  }}
/>
      </div>
    </main>
  );
}
