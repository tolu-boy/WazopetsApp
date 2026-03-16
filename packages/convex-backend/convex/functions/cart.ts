import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

async function assertSelf(ctx: any, userId: string) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  if (identity.subject !== userId) throw new Error("Forbidden");
}

// Add to cart mutation
export const addToCart = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await assertSelf(ctx, args.userId);

    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId),
      )
      .unique();

    if (existing) {
      // Update existing quantity
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + args.quantity,
      });
    } else {
      // Create new cart item
      await ctx.db.insert("cartItems", {
        userId: args.userId,
        productId: args.productId,
        quantity: args.quantity,
        createdAt: new Date().toISOString(),
      });
    }
  },
});

// Get cart items query
export const getCartItems = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await assertSelf(ctx, args.userId);

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Optionally join product details
    const products = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item?.productId);
        return product
          ? {
              ...item,
              name: product.name,
              price: product.price,
              image: product.image,
            }
          : item;
      }),
    );

    // console.log(products, "products");

    return products;
  },
});

// Update cart quantity mutation
export const updateCartQuantity = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await assertSelf(ctx, args.userId);

    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { quantity: args.quantity });
    }
  },
});

export const removeFromCart = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await assertSelf(ctx, args.userId);

    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
