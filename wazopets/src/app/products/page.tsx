"use client";
import { Suspense, useState } from "react";
import { ProductGrid } from "../../components/ProductGrid";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Dog Food",
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading market...</p>
          </div>
        }
      >
        <ProductGrid
          category={selectedCategory}
          //   onCategoryChange={setSelectedCategory} onAuthOpen={function (): void {
          //       throw new Error("Function not implemented.");
          //   } }
        />
      </Suspense>
      {/* <ProductGrid
              category={selectedCategory}
            //   onCategoryChange={setSelectedCategory} onAuthOpen={function (): void {
            //       throw new Error("Function not implemented.");
            //   } }     
              
              
              /> */}
    </div>
  );
}
