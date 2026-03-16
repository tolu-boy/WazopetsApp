// store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  // brand: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
  setItems: (items: CartItem[]) => void;
  // Add these to the interface
  cartNeedsSync: boolean; // whether local guest cart has unsynced changes
  setCartNeedsSync: (v: boolean) => void;

  lastSyncedUserId: string | null; // track which user the store synced for
  setLastSyncedUserId: (id: string | null) => void; // For syncing merged cart from Convex
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // add items to cart or increase quantity if already exists
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            // If item exists, increase quantity
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
              // cartNeedsSync: true,
            };
          } else {
            // Add new item with quantity 1
            return {
              items: [...state.items, { ...item, quantity: 1 }],
              // cartNeedsSync: true,
            };
          }
        });
      },

      setItems: (items) => {
        set({ items });
      },

      // Inside the create() initializer object
      cartNeedsSync: false, // default - no pending changes
      setCartNeedsSync: (v) => set({ cartNeedsSync: v }),

      lastSyncedUserId: null,
      setLastSyncedUserId: (id) => set({ lastSyncedUserId: id }),

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          // cartNeedsSync: true,
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
          // cartNeedsSync: true,
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getTax: () => {
        // Tax removed per latest pricing rules
        return 0;
      },

      getDiscount: () => {
        // Discounts disabled per latest pricing rules
        return 0;
      },

      getShipping: () => {
        // Flat shipping per latest pricing rules
        return 5000;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        return subtotal + tax - discount + shipping;
      },
    }),
    {
      name: "cart-storage", // name for localStorage key
    },
  ),
);
