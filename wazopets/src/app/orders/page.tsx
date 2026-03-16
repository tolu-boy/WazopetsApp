"use client";

import React from "react";
import { api } from "@wazo/convex-api/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface Order {
  _id: string; // Convex adds this automatically
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentReference?: string;
  paymentStatus?: "pending" | "paid" | "failed";
  shippingAddress?: string;
  deliveryStatus?:
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | string;
  createdAt?: string;
  updatedAt?: string;
}

const Page = () => {
  const { user } = useUser();
  // const { isLoaded, isSignedIn } = useAuth();
  // if (!isLoaded) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
  //       Loading orders, please login or register before checkout...
  //     </div>
  //   );
  // }
  // if (!isSignedIn) {
  //   // 👇 Render the Clerk redirect component
  //   return <RedirectToSignIn redirectUrl="/checkout" />;
  // }
  // Fetch real orders from Convex
  const orders = useQuery(
    api.functions.order.getOrderByUserId,
    user?.id ? { userId: user.id } : "skip",
  ) as Order[] | undefined;

  // Loading state
  if (!orders) {
    return (
      <div className="p-6 text-center text-gray-500">No orders found...</div>
    );
  }

  const processingOrders =
    orders.filter((o) =>
      ["processing", "shipped"].includes(o.deliveryStatus?.toLowerCase() ?? ""),
    ) || [];

  const completedOrders =
    orders.filter((o: any) =>
      ["delivered", "cancelled"].includes(
        o.deliveryStatus?.toLowerCase() ?? "",
      ),
    ) || [];

  // OrderCard Component
  function OrderCard({
    order,
    showActions,
  }: {
    order: Order;
    showActions: boolean;
  }) {
    const status = order.deliveryStatus || "Unknown";
    const paymentStatus = order.paymentStatus || "Unknown";

    const statusColor =
      status === "processing"
        ? "bg-blue-100 text-blue-700"
        : status === "delivered"
          ? "bg-green-100 text-green-700"
          : status === "shipped"
            ? "bg-yellow-100 text-yellow-700"
            : status.includes("cancel")
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700";

    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="md:flex md:items-center justify-between">
          <span className="font-semibold text-sm">Order #{order._id}</span>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm text-gray-700">
                ₦{order.totalAmount}
              </span>

              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusColor}`}
              >
                {status}
              </span>
            </div>
            <span
              className={`px-3 py-1 my-2 text-xs font-semibold rounded-full capitalize ${
                paymentStatus === "paid"
                  ? "bg-green-100 text-green-700"
                  : paymentStatus === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : paymentStatus === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
              }`}
            >
              {paymentStatus === "paid"
                ? "Payment paid"
                : paymentStatus === "pending"
                  ? "Payment pending"
                  : paymentStatus === "failed"
                    ? "Payment failed"
                    : `Payment ${paymentStatus.toLowerCase()}`}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-1">
          {order.createdAt
            ? new Date(order.createdAt).toDateString()
            : "No date"}
        </div>

        <div className="mt-3 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 border-t pt-2">
              <img
                src={item.image}
                alt=""
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold">{item.name}</div>
                <div className="text-xs text-gray-500">
                  Quantity: {item.quantity} • ₦{item.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showActions && (
          <div className="flex gap-3 mt-3">
            <button className="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-semibold hover:bg-gray-50">
              Reorder
            </button>
            <button className="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-semibold hover:bg-gray-50">
              View Details
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-6">Your Orders</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Processing Orders */}
          <section aria-label="Current Processing Orders">
            <div className="text-lg font-semibold mb-3">
              Current Processing Orders
            </div>

            <div className="space-y-4">
              {processingOrders.length === 0 && (
                <p className="text-gray-500 text-sm">No processing orders.</p>
              )}

              {processingOrders.map((order) => (
                <OrderCard key={order._id} order={order} showActions={false} />
              ))}
            </div>
          </section>

          {/* Completed Orders */}
          <section aria-label="Previous Completed Orders">
            <div className="text-lg font-semibold mb-3">
              Previous Completed Orders
            </div>

            <div className="space-y-4">
              {completedOrders.length === 0 && (
                <p className="text-gray-500 text-sm">No completed orders.</p>
              )}

              {completedOrders.map((order) => (
                <OrderCard key={order._id} order={order} showActions={false} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
