import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

async function assertSelf(ctx: any, userId: string) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  if (identity.subject !== userId) throw new Error("Forbidden");
}

export const createPostAd = mutation({
  args: {
    userId: v.string(),
    animalType: v.string(),
    breed: v.string(),
    age: v.number(),
    price: v.number(),
    description: v.string(),
    images: v.array(v.string()), // MULTIPLE IMAGES

    sellerName: v.string(),
    sellerEmail: v.string(),
    sellerPhone: v.string(),
    sellerCity: v.string(),
    sellerState: v.string(),
    sellerAddress: v.string(),
  },

  handler: async (ctx, args) => {
    await assertSelf(ctx, args.userId);

    return await ctx.db.insert("ads", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getAllAds = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("ads")
      .order("desc") // newest first
      .take(limit ?? 10);
  },
});

export const getAdsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    await assertSelf(ctx, userId);

    return await ctx.db
      .query("ads")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getAdById = query({
  args: {
    id: v.id("ads"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
