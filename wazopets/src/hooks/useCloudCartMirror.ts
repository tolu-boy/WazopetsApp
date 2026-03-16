"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@wazo/convex-api/api";
import { useCartStore } from "@/store/useCartStore";
import { normalizeCloudCart } from "@/lib/normalizeCart";

export function useCloudCartMirror() {
  const { user } = useUser();

  const cloudCart = useQuery(
    api.functions.cart.getCartItems,
    user?.id ? { userId: user.id } : "skip",
  );

  const setItems = useCartStore((s) => s.setItems);

  useEffect(() => {
    if (!user?.id) return;
    if (!cloudCart) return;

    setItems(normalizeCloudCart(cloudCart));
  }, [user?.id, cloudCart, setItems]);
}
