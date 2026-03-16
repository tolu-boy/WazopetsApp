// convex/actions/paystack.ts
"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import crypto from "crypto";

type WebhookResult = { verified: false } | { verified: true; data: any };

export const processWebhook = action({
  args: {
    rawBody: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, { rawBody, signature }): Promise<WebhookResult> => {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      throw new Error("Missing PAYSTACK_SECRET_KEY");
    }

    // Verify signature
    const expected = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expected) {
      return { verified: false };
    }

    console.log("this is raw body", rawBody);

    // Parse event
    const event = JSON.parse(rawBody);
    const data = event.data;
    const reference = data.reference;
    const amountKobo = Number(data.amount);
    const currency = data.currency;
    const status = data.status;

    // Process payment
    const result = await ctx.runMutation(api.functions.order.finalizePayment, {
      paystackReference: reference,
      paystackAmountKobo: amountKobo,
      currency,
      transactionStatus: status,
    });

    return { verified: true, data: result };
  },
});
