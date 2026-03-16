"use client";
// src/hooks/useCartSync.ts
import { useUser } from "@clerk/nextjs";
import { useConvex } from "convex/react";
import { useEffect } from "react";
import { syncGuestCartToServer } from "@/lib/syncGuestCart";
import { useCartStore } from "./useCartStore";

/**
 * This hook watches for login and triggers cart sync automatically.
 */
export function useCartSync() {
  const { user } = useUser();
  const convex = useConvex();

  // Add these selects
  const cartNeedsSync = useCartStore((s) => s.cartNeedsSync);
  const setCartNeedsSync = useCartStore((s) => s.setCartNeedsSync);
  const lastSyncedUserId = useCartStore((s) => s.lastSyncedUserId);
  const setLastSyncedUserId = useCartStore((s) => s.setLastSyncedUserId);

  useEffect(() => {
    if (!user?.id) return;

    // Only sync when guest cart has changes OR new user session
    if (cartNeedsSync || lastSyncedUserId !== user.id) {
      syncGuestCartToServer(user.id, convex)
        .then(() => {
          setCartNeedsSync(false); // ✅ synced, no more pending changes
          setLastSyncedUserId(user.id); // ✅ remember who we synced for
        })
        .catch((e) => {
          console.error("Cart sync failed:", e);
          // leave cartNeedsSync = true so we can retry later
        });
    }
  }, [user?.id, cartNeedsSync, lastSyncedUserId]);
}
