// src/lib/syncGuestCart.ts
import { useCartStore } from "@/store/useCartStore";
import { api } from "@wazo/convex-api/api";
import type { Id } from "@wazo/convex-api/dataModel";

/**
 * BEST PRACTICE: Merge local (Zustand) cart with Convex cart when user logs in
 *
 * Strategy:
 * 1. Fetch existing Convex cart (if any)
 * 2. Merge quantities for same products
 * 3. Sync merged result to Convex
 * 4. Populate Zustand with merged result
 */
export async function syncGuestCartToServer(userId: string, convexClient: any) {
  console.log("function to sync started22222222");

  const localCart = useCartStore.getState().items;
  console.log("function to sync started 33333333", userId);

  // Step 1: Fetch existing Convex cart (if any)
  // const getCartItems = convexClient.query(api.functions.cart.getCartItems,
  //   {userId}  );
  // const convexCart: any[] = (await getCartItems({ userId })) || [];

  const convexCart = await convexClient.query(api.functions.cart.getCartItems, {
    userId,
  });

  console.log("function to sync started44444");

  console.log("Local cart before merge:", localCart);
  console.log("Convex cart before merge:", convexCart);

  // Early exit: if carts are already equal, do nothing
  const toMap = (arr: any[]) => {
    const m = new Map<string, number>();
    for (const it of arr) {
      const pid = (it.productId ?? it.id) as string;
      const qty = it.quantity as number;
      m.set(pid, qty);
    }
    return m;
  };

  const localMap = toMap(localCart);
  const cloudMap = toMap(convexCart);
  let equal = localMap.size === cloudMap.size;
  if (equal) {
    for (const [pid, q] of localMap) {
      if (cloudMap.get(pid) !== q) {
        equal = false;
        break;
      }
    }
  }
  if (equal) {
    return; // already in sync
  }

  // Step 2: Create a merged cart map
  // Key: productId, Value: { quantity, item data }
  const mergedCart = new Map<string, { quantity: number; item: any }>();
  console.log("function to sync started5555");

  // Add Convex cart items to merge map
  for (const convexItem of convexCart) {
    const productId = convexItem.productId;
    mergedCart.set(productId, {
      quantity: convexItem.quantity,
      item: {
        id: productId,
        name: convexItem.name,
        price: convexItem.price,
        image: convexItem.image,
        quantity: convexItem.quantity,
      },
    });

    console.log("function to sync started66666", convexItem);
  }

  // Add local cart items, merging quantities if product already exists
  for (const localItem of localCart) {
    const productId = localItem.id;
    const existing = mergedCart.get(productId);
    console.log("function to sync started777777");

    if (existing) {
      // Product exists in both → add quantities
      existing.quantity += localItem.quantity;
      existing.item.quantity = existing.quantity;

      console.log(
        `Merging product ${productId}: ${
          existing.quantity - localItem.quantity
        } + ${localItem.quantity} = ${existing.quantity}`,
      );

      console.log("function to sync started8888");
    } else {
      // New product → add to merge map
      mergedCart.set(productId, {
        quantity: localItem.quantity,
        item: localItem,
      });

      console.log("function to sync started999999");
    }
  }

  // Step 3: Sync merged cart to Convex
  // const addToCart = convexClient.mutation(api.functions.cart.addToCart);
  console.log("sync merged to convex");
  console.log("function to sync started 1010101010");

  // const updateCartQuantity = convexClient.mutation(
  //   api.functions.cart.updateCartQuantity
  // );

  console.log("sync merged to convex");

  console.log("function to sync started eleleveven");

  for (const [productId, { quantity, item }] of mergedCart) {
    const convexItem = convexCart.find((ci: any) => ci.productId === productId);
    console.log("function to sync started 121212221211222");

    if (convexItem) {
      if (convexItem && convexItem.quantity !== quantity) {
        // Item exists in Convex → update quantity to merged total
        await convexClient.mutation(api.functions.cart.updateCartQuantity, {
          userId,
          productId: productId as Id<"products">,
          quantity,
        });

        console.log("function to sync started 13331313131");
      }
    } else {
      // New item → add to Convex

      await convexClient.mutation(api.functions.cart.addToCart, {
        userId,
        productId: productId as Id<"products">,
        quantity,
      });

      console.log("function to sync started 14441414141414141");
    }
  }

  // Step 4: Fetch final merged cart from Convex and populate Zustand
  const finalCart = await convexClient.query(api.functions.cart.getCartItems, {
    userId,
  });

  console.log("Final merged cart from Convex:", finalCart);

  if (finalCart && finalCart.length > 0) {
    // Normalize Convex cart items to match Zustand structure
    const normalizedItems = finalCart.map((item: any) => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));

    console.log("Normalized items for Zustand:", normalizedItems);

    // Set Zustand cart directly to merged result (efficient one-time update)
    useCartStore.getState().setItems(normalizedItems);
  } else {
    // No items after merge → clear local cart
    useCartStore.getState().clearCart();
  }

  console.log("Final Zustand cart:", useCartStore.getState().items);
}
