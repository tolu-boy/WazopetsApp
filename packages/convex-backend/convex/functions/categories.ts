import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("categories", {
      name: args.name,
      description: args.description,
      icon: args.icon,
      bannerImage: args.bannerImage,
      createdAt: now,
    });
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Category not found");

    const patch: Partial<Doc<"categories">> = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.description !== undefined) patch.description = args.description;
    if (args.icon !== undefined) patch.icon = args.icon;
    if (args.bannerImage !== undefined) patch.bannerImage = args.bannerImage;

    await ctx.db.patch(args.id, patch);
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id);
    if (!existing) return;

    const productsUsing = await ctx.db
      .query("products")
      .withIndex("by_categoryId", (q) => q.eq("categoryId", id))
      .take(1);

    if (productsUsing.length > 0) {
      throw new Error("Cannot delete category with products");
    }

    await ctx.db.delete(id);
  },
});

