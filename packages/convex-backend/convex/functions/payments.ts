import { mutation,query } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.string(), // relational link to user
    orderId: v.id("orders"), // relational link to order
    amount: v.number(), // amount paid
    currency: v.string(), // e.g. "USD", "NGN"
    paymentMethod: v.optional(v.string()), // e.g. "card", "bank_transfer", "wallet"
    status: v.string(), // "pending" | "successful" | "failed" | "refunded"
    reference: v.string(), // unique payment reference from gateway
    provider: v.optional(v.string()), // e.g. "Paystack", "Stripe"
    metadata: v.optional(v.any()), // optional payment metadata
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const payment = await ctx.db.insert("payments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return { payment };
  },
});

export const upsertByReference = mutation({
  args: {
    userId: v.string(),
    orderId: v.id("orders"),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.optional(v.string()),
    status: v.string(),
    reference: v.string(),
    provider: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    // Check if a payment with this reference already exists
    const existing = await ctx.db
      .query("payments")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return { payment: existing._id, upserted: "updated" };
    }

    const payment = await ctx.db.insert("payments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return { payment, upserted: "created" };
  },
});



export const getAllPayments = query(async (ctx) => {
  // Fetch all payments from the 'payments' table
  const payments = await ctx.db.query("payments").order("desc").collect();

  return payments;
});
