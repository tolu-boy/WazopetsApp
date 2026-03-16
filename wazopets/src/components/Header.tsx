"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  Menu,
  Heart,
  User,
  Loader2,
  NotepadText,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  SignInButton,
  UserButton,
  SignOutButton,
  useAuth,
} from "@clerk/nextjs";
import { useCartStore } from "@/store/useCartStore";
interface HeaderProps {

}

export function Header({}: 

HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // ✅ current route
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white shadow-sm  sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span className="flex items-center">
            <span className="mr-2">🚚</span>
            Free delivery on orders above ₦550,000 in Lagos & Abuja
          </span>
          <span className="hidden sm:flex items-center">
            <span className="mr-2">📞</span>
            Call: +234 7031365734
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-black font-bold text-2xl">🐾</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                WazoPets
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Your Animal Needs Store
              </p>
            </div>
          </div>



          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for pet food, animal feed, supplies, care products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm hover:shadow-md"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                onClick={() => {
                  if (!searchQuery.trim()) return;
                  router.push(
                    `/products?search=${encodeURIComponent(searchQuery)}`,
                  );
                  setSearchQuery("");
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 ">
        

            <Link
              href="/cart"
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:block text-sm font-medium">Cart</span>
              {mounted && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center gap-3">
              {/* ✅ Clerk Auth Logic */}
              {!isLoaded ? (
                // Show skeleton loader until Clerk initializes
                <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
              ) : isSignedIn ? (
                // When user is signed in
                <div className="flex items-center gap-3">
                  <Link
                    href="/orders"
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50 relative"
                  >
                    <NotepadText className="w-5 h-5" />
                    <span className="hidden md:block text-sm font-medium">
                      Orders
                    </span>
                  </Link>
                  <UserButton />
                  <SignOutButton>
                    <button className="px-4 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                // When user is signed out
                <SignInButton fallbackRedirectUrl={pathname}>
                  <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2 ">
                    <Loader2 className="hidden group-hover:inline-block w-4 h-4 animate-spin" />
                    Login
                  </button>
                </SignInButton>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex mt-6 space-x-8 border-t border-gray-100 pt-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors pb-2 border-b-2 border-transparent hover:border-green-200"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors pb-2 border-b-2 border-transparent hover:border-green-200"
          >
            Products
          </Link>

          <Link
            href="/browse-ads"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors pb-2 border-b-2 border-transparent hover:border-green-200"
          >
            Browse Ads
          </Link>

          <Link
            href="/post-ads"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors pb-2 border-b-2 border-transparent hover:border-green-200"
          >
            Post Ads
          </Link>

         
         
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto p-4 space-y-2">
            <button
              onClick={() => {
                // onViewChange('home');
                setMobileMenuOpen(false);
                router.push("/");
              }}
              className="block w-full text-left text-gray-600 hover:text-green-600  font-medium"
            >
              Home
            </button>
            <button
              onClick={() => {
                // onViewChange('products');
                setMobileMenuOpen(false);
                router.push("/products");
              }}
              className="block w-full text-left text-gray-600 hover:text-green-600 py-2 font-medium"
            >
              All Products
            </button>


            <button
              onClick={() => {
                // onViewChange('products');
                setMobileMenuOpen(false);
                router.push("/products");
              }}
              className="block w-full text-left text-gray-600 hover:text-green-600 py-2 font-medium"
            >
              Browse Ads
            </button>



            <button
              onClick={() => {
                // onViewChange('products');
                setMobileMenuOpen(false);
                router.push("/products");
              }}
              className="block w-full text-left text-gray-600 hover:text-green-600 py-2 font-medium"
            >
              Post Ads
            </button>

            {/* <button
              onClick={() => {
                // onViewChange('products');
                setMobileMenuOpen(false);
                router.push("/orders");
              }}
              className="block w-full text-left text-gray-600 hover:text-green-600 py-2 font-medium"
            >
              Orders
            </button> */}

            {!isLoaded ? (
              // Show skeleton loader until Clerk initializes
              <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
            ) : isSignedIn ? (
              // When user is signed in
              <div className="">

                 <button
              onClick={() => {
                // onViewChange('products');
                setMobileMenuOpen(false);
                router.push("/orders");
              }}
              className="block w-full text-left text-gray-600 hover:text-green-600 py-2 font-medium"
            >
              Orders
            </button>
                <div>
                  <UserButton />
                </div>
                <div className="py-2">
                  <SignOutButton>
                    <button className="px-4 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition">
                      Sign Out
                    </button>
                  </SignOutButton>{" "}
                </div>
              </div>
            ) : (
              // When user is signed out
              <SignInButton fallbackRedirectUrl={pathname}>
                <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2 ">
                  <Loader2 className="hidden group-hover:inline-block w-4 h-4 animate-spin" />
                  Login
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
