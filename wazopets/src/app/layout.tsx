import { AuthModal } from "@/components/AuthModal";
import { Cart } from "@/components/Cart";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import { useState } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { useCartSync } from "@/store/useCartSync";
import { CartSyncClient } from "@/components/CartSyncClient";
import CloudCartMirrorClient from "@/components/CloudCartMirrorClient";
import { Analytics } from '@vercel/analytics/next';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "WazoPets - Premium Animal Supplies for Pets & Livestock",
  description: "Shop quality food, supplies, and care products for pets, livestock, poultry, aquatics, and exotic animals. Fast delivery across Nigeria.",
  keywords: ["pet shop", "animal supplies", "livestock feed", "pet food", "dog food", "cat food", "poultry feed", "Nigeria"],
  authors: [{ name: "WazoPets" }],
  creator: "WazoPets",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://www.wazopets.com",
    siteName: "WazoPets",
    title: "WazoPets - Premium Animal Supplies for Pets & Livestock",
    description: "Shop quality animal products including pet food, livestock feed, and poultry supplies with fast delivery across Nigeria",
  },
  twitter: {
    card: "summary",
    title: "WazoPets - Premium Pet Supplies",
    description: "Quality pet supplies with fast delivery",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [cartOpen, setCartOpen] = useState(false);
  // const [authModalOpen, setAuthModalOpen] = useState(false);
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <ClerkProvider>
          <ConvexClientProvider>
            <CartSyncClient />
            <CloudCartMirrorClient />
            <Header
            // onCartOpen={() => setCartOpen(true)}
            // onAuthOpen={() => setAuthModalOpen(true)}
            />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} /> */}
            {/* <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
            /> */}
            <Toaster />
          </ConvexClientProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>

    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >

    //     {children}
    //   </body>
    // </html>
  );
}
