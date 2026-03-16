"use client";
import { formatPrice } from "@/lib/formatters";
import { ShoppingCart } from "lucide-react";
import React from "react";

interface OrderSummaryProps {
  getSubtotal: () => number;
  getTax: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
  onProceed: () => void;
}

const OrderSummary = ({
  getSubtotal,
  getTax,
  getDiscount,
  getShipping,
  getTotal,
  onProceed,
}: OrderSummaryProps) => {
  return (
    <div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">
                {/* ₹{getSubtotal().toFixed(2)} */}
                {formatPrice(getSubtotal())}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span className="font-medium">{formatPrice(getTax())}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span className="font-medium text-red-500">
                {/* -₹{getDiscount().toFixed(2)} */}
                {formatPrice(getDiscount())}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium">
                {/* ₹{getShipping().toFixed(2)} */}
                {formatPrice(getShipping())}
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  {/* ₹{getTotal().toFixed(2)} */}
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onProceed}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
