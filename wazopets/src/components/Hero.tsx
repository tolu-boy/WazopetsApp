"use client";

import { ArrowRight, Truck, Shield, Headphones, Play } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroProps {
  onAuthOpen: () => void;
}

export function Hero() {
  const router = useRouter();
// { onAuthOpen }: HeroProps
  return (
    <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="space-y-6">
          
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Everything
                <span className="text-yellow-300"> for all your animals </span>
                from pets to livestock.
              </h1>

              <p className="text-xl lg:text-xl text-green-100 leading-relaxed max-w-2xl">
                Get everything your animals need - from pets and livestock to poultry and exotic creatures. Premium nutrition, supplies, and expert care products. Fast, reliable delivery anywhere in Nigeria.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => router.push('/products')} className="group bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center">
                Shop Now
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
             
            </div>

            {/* Trust Indicators */}
            {/* <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-green-200 text-sm">Happy Animals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-green-200 text-sm">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-green-200 text-sm">Support</div>
              </div>
            </div> */}
          </div>

          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=500&fit=crop"
                alt="Happy animals with their favorite products"
                className="rounded-2xl w-full h-96 object-cover shadow-xl"
              />

              {/* Floating Cards */}
              {/* <div className="absolute -top-4 -left-4 bg-yellow-400 text-black px-6 py-3 rounded-2xl font-bold shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
                <div className="text-2xl font-black">30%</div>
                <div className="text-sm">OFF</div>
              </div> */}

              <div className="absolute -bottom-4 -right-4 bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Free Delivery</span>
                </div>
                <div className="text-sm text-gray-600">
                  Orders above ₦550,0000
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 text-white">
          <div className="group flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
            <div className="bg-white/20 p-4 rounded-xl group-hover:scale-110 transition-transform">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Free Delivery</h3>
              <p className="text-green-100">On orders above ₦550,000</p>
            </div>
          </div>

          <div className="group flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
            <div className="bg-white/20 p-4 rounded-xl group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Quality Guarantee</h3>
              <p className="text-green-100">100% authentic products</p>
            </div>
          </div>

          <div className="group flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
            <div className="bg-white/20 p-4 rounded-xl group-hover:scale-110 transition-transform">
              <Headphones className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg">24/7 Support</h3>
              <p className="text-green-100">Expert animal care advice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
