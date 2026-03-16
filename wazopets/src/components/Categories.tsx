"use client";

import { useRouter } from "next/navigation";

interface CategoriesProps {
  onCategorySelect: (category: string) => void;
}

export function Categories() {
  const router = useRouter();
  const categories = [
    {
      id: "dog-food",
      name: "Dog Food & Care",
      image:
        "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=300&h=200&fit=crop",
      count: "avaliable",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: "cat-food",
      name: "Cat Food & Supplies",
      image:
        "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300&h=200&fit=crop",
      count: "avaliable",
      color: "from-purple-400 to-purple-600",
    },
   
    {
      id: "Animals",
      name: "Animals Supplies",
      image:
        "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300&h=200&fit=crop",
      count: "avaliable",
      color: "from-yellow-400 to-yellow-600",
    },
   
    
    // {
    //   id: "health-supplements",
    //   name: "Health & Supplements",
    //   image:
    //   "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300&h=200&fit=crop",
    //   count: "110+ products",
    //   color: "from-red-400 to-red-600",
    // },
   
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="mr-2">🏪</span>
            Shop by Category
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything for Your Animals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From pets and livestock to poultry and exotic animals - we've got premium nutrition, supplies, and care products for all your animals
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => router.push('/products')}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity`}
                />

                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <h3 className="font-bold text-lg mb-1 group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90 group-hover:translate-y-0 translate-y-2 transition-transform duration-300 delay-75">
                    {category.count}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Shop Now →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/products')}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
}
