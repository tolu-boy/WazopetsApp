"use client";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/formatters";
import OrderSummary from "@/components/orderSummary";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@wazo/convex-api/api";
import { Id } from "@wazo/convex-api/dataModel";

export default function ShoppingCartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getDiscount,
    getShipping,
    getTotal,
  } = useCartStore();

  const { user } = useUser();
  const updateCartQuantityMut = useMutation(
    api.functions.cart.updateCartQuantity,
  );
  const removeFromCartMut = useMutation(api.functions.cart.removeFromCart);

  // Optimistic quantity change with backend sync & rollback
  const handleQuantityChange = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const prevQty = item.quantity;
    const nextQty = prevQty + delta;
    if (nextQty < 1) return;

    updateQuantity(id, nextQty);

    if (user?.id) {
      try {
        await updateCartQuantityMut({
          userId: user.id,
          productId: id as Id<"products">,
          quantity: nextQty,
        });
      } catch (e) {
        console.error("Convex updateCartQuantity failed, rolling back:", e);
        updateQuantity(id, prevQty);
      }
    }
  };

  // Optimistic remove with backend sync & rollback
  const handleRemoveItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    removeItem(id);

    if (user?.id) {
      try {
        await removeFromCartMut({
          userId: user.id,
          productId: id as Id<"products">,
        });
      } catch (e) {
        console.error("Convex removeFromCart failed, rolling back:", e);
        for (let i = 0; i < item.quantity; i++) {
          useCartStore.getState().addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
          });
        }
      }
    }
  };

  // Optimistic clear with backend sync & rollback
  const handleClearCart = async () => {
    if (!items.length) return;
    const snapshot = [...items];

    clearCart();

    if (user?.id) {
      try {
        for (const it of snapshot) {
          await removeFromCartMut({
            userId: user.id,
            productId: it.id as Id<"products">,
          });
        }
      } catch (e) {
        console.error("Convex clearCart failed, rolling back:", e);
        useCartStore.getState().setItems(snapshot);
      }
    }
  };
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Looks like you haven't added any items to your cart yet
            </p>
            <Link href="/products">
              <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">
          Your Shopping Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="md:flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="md:w-24 md:h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="md:text-lg text-xl font-semibold text-gray-900 mb-1 my-2">
                      {item.name}
                    </h3>
                    {/* <p className="text-sm text-gray-500 mb-2">{item.brand}</p> */}
                    <p className="md:text-sm text-lg text-gray-600 my-2">
                      {formatPrice(item.price)} per item
                    </p>
                  </div>

                  <div className="md:flex flex-col items-end gap-4">
                    <div className="flex items-center gap-3 my-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium bg-gray-100 py-2 rounded-md">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="md:flex items-center gap-4">
                      <p className="text-xl font-semibold text-blue-600 my-2">
                        {/* ₹{(item.price * item.quantity).toFixed(2)} */}
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleClearCart}
              className="w-full sm:w-auto px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-semibold transition-colors"
            >
              Clear Cart{" "}
            </button>
          </div>

          {/* Order Summary */}
          <OrderSummary
            getSubtotal={getSubtotal}
            getTax={getTax}
            getDiscount={getDiscount}
            getShipping={getShipping}
            getTotal={getTotal}
            onProceed={() => router.push("/checkout")}
          />
        </div>
      </div>
    </div>
  );
}
