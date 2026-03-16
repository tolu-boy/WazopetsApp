import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { internal } from "../_generated/api"; // ✅ Import internal API

async function assertSelf(ctx: any, userId: string) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  if (identity.subject !== userId) throw new Error("Forbidden");
}

// Simple helper to generate a Paystack reference we can also store on the order
const makeReference = () =>
  `ORDER_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;

// const resend = new Resend(process.env.RESEND_API_KEY);

// 1) Create a pending order + reference + authoritative amount (naira + kobo)
export const createPending = mutation({
  args: {
    userId: v.string(),
    shippingAddress: v.string(),
  },
  handler: async (ctx, args) => {
    await assertSelf(ctx, args.userId);

    const now = new Date().toISOString();
    // Re-fetch cart + product prices server-side to avoid client tampering
    const userCartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    if (!userCartItems.length) {
      // throw new Error("Cart is empty");

      return {
        error: "Cart Empty",
        message: `Cart is Empty`,
      };
    }

    const items = [];
    let subtotal = 0;

    for (const item of userCartItems) {
      const product = await ctx.db.get(item.productId);
      if (!product) {
        // throw new Error(`Product not found: ${item.productId}`);
        return {
          error: "Product Not Found",
          message: `Product not found: ${item.productId}`,
        };
      }
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      items.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.image,
      });
    }

    // Mirror client-side pricing rules server-side (no tax/discount; flat shipping)
    const shipping = 5000; // flat NGN shipping
    const totalAmount = subtotal + shipping;
    const expectedAmountKobo = Math.round(totalAmount * 100);

    // Generate a reference we can also send to Paystack from the client
    const paystackReference = makeReference();

    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      items,
      totalAmount,
      paymentReference: paystackReference,
      paymentStatus: "pending",
      shippingAddress: args.shippingAddress,
      deliveryStatus: "processing",
      createdAt: now,
      updatedAt: now,
    });

    // Do NOT clear cart yet — wait for payment confirmation
    return {
      orderId,
      paystackReference,
      amountKobo: expectedAmountKobo,
      currency: "NGN",
      totalAmount,
    };
  },
});


export const finalizePayment = mutation({
  args: {
    paystackReference: v.string(),
    paystackAmountKobo: v.number(),
    currency: v.string(),
    transactionStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();
    const now = new Date().toISOString();

    // 🧠 WIDE EVENT (canonical log line)
    const event: Record<string, any> = {
      event_name: "payment_finalize",
      timestamp: now,

      provider: "paystack",
      payment_reference: args.paystackReference,
      currency: args.currency,
      transaction_status: args.transactionStatus,
      received_amount_kobo: args.paystackAmountKobo,
    };

    try {
      // 1️⃣ Find order (idempotent)
      const order = await ctx.db
        .query("orders")
        .withIndex("by_paymentReference", (q) =>
          q.eq("paymentReference", args.paystackReference),
        )
        .first();

      if (!order) {
        event.outcome = "error";
        event.error = {
          type: "OrderNotFound",
          message: "Order not found for reference",
        };

        // throw new Error("Order not found for reference");

        return {
          error: "OrderNotFound",
          message: "Order not found for reference",
        };
      }

      // Attach core business context (HIGH VALUE)
      event.order_id = order._id;
      event.user_id = order.userId;
      event.previous_payment_status = order.paymentStatus;
      event.cart_item_count = order.items.length;

      // 2️⃣ Idempotency: already paid
      if (order.paymentStatus === "paid") {
        event.outcome = "idempotent_return";
        event.final_payment_status = "paid";
        event.amount_charged = order.totalAmount;

        return {
          orderId: order._id,
          amountCharged: order.totalAmount,
          paymentStatus: "paid",
        };
      }

      // 3️⃣ Recalculate amount server-side
      const subtotal = order.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      );

      const shipping = 5000;
      const totalAmount = subtotal + shipping;
      const expectedAmountKobo = Math.round(totalAmount * 100);

      const amountMatches =
        args.currency === "NGN" &&
        args.paystackAmountKobo === expectedAmountKobo;

      event.pricing = {
        subtotal,
        shipping,
        total_amount: totalAmount,
        expected_amount_kobo: expectedAmountKobo,
        amount_matches: amountMatches,
      };

      let paymentStatus: "paid" | "failed" | "pending" = "pending";

      if (args.transactionStatus === "success" && amountMatches) {
        paymentStatus = "paid";
      } else if (args.transactionStatus === "failed") {
        paymentStatus = "failed";
      }

      event.final_payment_status = paymentStatus;

      if (!amountMatches && paymentStatus !== "pending") {
        await ctx.db.patch(order._id, {
          paymentStatus: "failed",
          updatedAt: now,
        });

        event.outcome = "failed";
        event.error = {
          type: "AmountMismatch",
          message: "Payment amount mismatch",
        };

        return {
          error: "Payment amount mismatch",
          message: "Payment amount mismatch",
        };

        // throw new Error("Payment amount mismatch");
      }

      // 4️⃣ Update order
      await ctx.db.patch(order._id, {
        paymentStatus,
        paymentReference: args.paystackReference,
        totalAmount,
        updatedAt: now,
      });

      // 5️⃣ PAYMENT UPSERT (IDEMPOTENT)
      const existingPayment = await ctx.db
        .query("payments")
        .withIndex("by_reference", (q) =>
          q.eq("reference", args.paystackReference),
        )
        .first();

      if (existingPayment) {
        event.payment_record = "updated";

        if (existingPayment.status !== paymentStatus) {
          await ctx.db.patch(existingPayment._id, {
            status: paymentStatus,
            amount: totalAmount,
            currency: args.currency,
            updatedAt: now,
            metadata: {
              transactionStatus: args.transactionStatus,
              paystackAmountKobo: args.paystackAmountKobo,
            },
          });
        }
      } else {
        event.payment_record = "created";

        await ctx.db.insert("payments", {
          userId: order.userId,
          orderId: order._id,
          amount: totalAmount,
          currency: args.currency,
          paymentMethod: "card",
          status: paymentStatus,
          reference: args.paystackReference,
          provider: "Paystack",
          metadata: {
            transactionStatus: args.transactionStatus,
            paystackAmountKobo: args.paystackAmountKobo,
          },
          createdAt: now,
          updatedAt: now,
        });
      }

      // 6️⃣ Clear cart only if paid
      if (paymentStatus === "paid") {
        const cartItems = await ctx.db
          .query("cartItems")
          .withIndex("by_userId", (q) => q.eq("userId", order.userId))
          .collect();

        event.cart_cleared = cartItems.length;

        for (const item of cartItems) {
          await ctx.db.delete(item._id);
        }
      }

      // 7️⃣ Email receipt
      if (paymentStatus === "paid") {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", order.userId))
          .first();

        event.receipt_email_sent = Boolean(user?.email);

        if (user?.email) {
          await ctx.scheduler.runAfter(0, internal.actions.emails.sendEmail, {
            to: user.email,
            subject: `Order Confirmation #${order._id}`,
            orderId: order._id,
            totalAmount,
            items: order.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
            })),
          });
        }
      }

      event.outcome = "success";
      event.amount_charged = totalAmount;

      return {
        orderId: order._id,
        amountCharged: totalAmount,
        paymentStatus,
      };
    } catch (error: any) {
      event.outcome = "error";
      event.error ??= {
        type: error?.name ?? "UnknownError",
        message: error?.message ?? "Unhandled error",
      };

      return {
        error: error?.name,
        message: error?.message,
      };

      // throw error;
    } finally {
      event.duration_ms = Date.now() - startTime;

      // 🧾 ONE canonical log line (truthful, queryable)
      console.log(event);
    }
  },
});

export const getOrderByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertSelf(ctx, args.userId);

    const userOrders = await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc") // 👈 newest first
      .collect();
    return userOrders;

    // return { orderId};
  },
});

// export const removeOldAddressFields = mutation({
//   handler: async (ctx) => {
//     const users = await ctx.db.query("users").collect();

//     console.log("gotten here");

//     for (const user of users) {
//       await ctx.db.patch(user._id, {
//         addressLine1: undefined,
//         addressLine2: undefined,
//       });
//     }
//   },
// });

// convex/functions/orders.ts

export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("orders")
      .order("desc")
      .collect();
  },
});



export const updateOrderDeliveryStatus = mutation({
  args: {
    orderId: v.id("orders"),
    deliveryStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(args.orderId, {
      deliveryStatus: args.deliveryStatus,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});