"use client";

import { useCartSync } from "@/store/useCartSync";

export function CartSyncClient() {
  useCartSync(); // runs only on client
  return null; // doesn’t render anything
}
