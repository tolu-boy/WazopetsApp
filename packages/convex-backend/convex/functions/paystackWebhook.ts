// convex/functions/paystackWebhook.ts
import { httpAction } from "../_generated/server";
import { api } from "../_generated/api";

export const paystackWebhook = httpAction(async (ctx, request) => {
  try {
    // Get raw body and signature
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature") || "";

    console.log("Webhook received", { rawBody, signature });

    // Call Node.js action to verify signature and process
    const result = await ctx.runAction(api.actions.paystack.processWebhook, {
      rawBody,
      signature,
    });

    if (!result.verified) {
      return new Response("Invalid signature", { status: 401 });
    }

    return new Response(JSON.stringify({ ok: true, result: result.data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return new Response("Processing error", { status: 500 });
  }
});
