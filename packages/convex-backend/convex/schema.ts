import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()), // 👈 new optional field
    // Checkout/Profile fields (all optional)
    phone: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    address: v.optional(v.string()),
    // addressLine1: v.optional(v.string()),
    // addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]), // ✅ now Convex knows about the index

  // PRODUCTS TABLE
  products: defineTable({
    name: v.string(),
    searchText: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.number(),
    vendorPrice: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    image: v.string(),
    imageUrls: v.array(v.string()), // ✅ Array of image URLs
    inStock: v.boolean(),
    categoryId: v.id("categories"), // ✅ relational link
    petType: v.optional(v.string()),
    badge: v.optional(v.string()), // "New" | "Sale" | "Best Seller"
    createdAt: v.optional(v.string()), // optional timestamp
  })
    .index("by_categoryId", ["categoryId"])
    .index("by_category_inStock", ["categoryId", "inStock"])
    .index("by_inStock", ["inStock"]) // ✅ fetch by inStock status

    .searchIndex("search_products", {
      // searchField: "name",
      searchField: "searchText",
      // You can add filterFields here if you want to filter results
      // while searching (e.g., only search inside a specific category)
      filterFields: ["categoryId", "inStock"],
    }),

  // categories TABLE
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    createdAt: v.optional(v.string()), // optional timestamp
  }),

  cartItems: defineTable({
    userId: v.string(), // relational link to user
    productId: v.id("products"), // relational link to product
    quantity: v.number(), // how many of this product
    createdAt: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_user_product", ["userId", "productId"]),

  orders: defineTable({
    userId: v.string(), // relational link to user
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(),
        name: v.string(),
        image: v.string(),
      }),
    ), // list of products in this order
    totalAmount: v.number(), // total paid
    paymentReference: v.optional(v.string()), // e.g. Paystack ref
    paymentStatus: v.optional(v.string()), // "pending" | "paid" | "failed"
    shippingAddress: v.optional(v.string()),
    deliveryStatus: v.optional(v.string()), // "processing" | "shipped" | "delivered"
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_paymentReference", ["paymentReference"]),

  // ✅ PAYMENTS TABLE (NEW)
  payments: defineTable({
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
  })
    .index("by_userId", ["userId"])
    .index("by_orderId", ["orderId"])
    .index("by_reference", ["reference"]),

  ads: defineTable({
    userId: v.string(), // owner of the listing
    // Pet information
    animalType: v.string(),
    breed: v.string(),
    age: v.number(),
    price: v.number(),
    description: v.optional(v.string()),
    images: v.array(v.string()),

    // Seller contact (snapshot at time of posting)
    sellerName: v.string(),
    sellerEmail: v.string(),
    sellerPhone: v.string(),
    sellerCity: v.string(),
    sellerState: v.string(),
    sellerAddress: v.optional(v.string()),

    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
});
