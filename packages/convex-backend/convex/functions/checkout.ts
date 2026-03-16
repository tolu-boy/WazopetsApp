import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

async function assertSelf(ctx: any, clerkId: string) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  if (identity.subject !== clerkId) throw new Error("Forbidden");
}

// Read checkout/profile fields from users table (by Clerk id)
export const getProfile = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    await assertSelf(ctx, clerkId);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();
    return user ?? null;
  },
});

// Update checkout/profile fields in users table (by Clerk id)
export const upsertProfile = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    address: v.optional(v.string()),
    // addressLine1: v.optional(v.string()),
    // addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertSelf(ctx, args.clerkId);

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!existing) {
      //   throw new Error(
      //     "User not found; ensure user record is created via webhook"
      //   );
      console.log("user not found ");
      return;
    }

    const now = new Date().toISOString();
    await ctx.db.patch(existing._id, { ...args, updatedAt: now });
    return existing._id;
  },
});
