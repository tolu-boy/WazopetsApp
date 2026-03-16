"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";

export const verify = action({
  args: {
    reference: v.string(),
    expectedAmountKobo: v.number(),
    email: v.string(),
  },
  handler: async (ctx, { reference, expectedAmountKobo, email }) => {
    console.log("2222222");

    console.log(
      "Using Paystack secret key:",
      !!process.env.PAYSTACK_SECRET_KEY,
    );

    const secret = process.env.PAYSTACK_SECRET_KEY!;
    console.log("22222223333333");

    if (!secret) throw new Error("PAYSTACK_SECRET_KEY not configured");
    console.log("22222224444444");

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
      },
    );

    console.log("this is the reply from pay stack", res);

    const data = await res.json();
    console.log("Paystack verify data", data);
    console.log("Paystack verify data status", data.status);

    if (!res.ok) console.log("Paystack verify failed", data);

    const transactionStatus = data?.data?.status === "success";
    const transactionAmount = Number(data?.data?.amount) === expectedAmountKobo;
    const transactionCurrency = data?.data?.currency === "NGN";
    const transactionEmail =
      (data?.data?.customer?.email || "").toLowerCase() === email.toLowerCase();

    if (
      !transactionStatus ||
      !transactionAmount ||
      !transactionCurrency ||
      !transactionEmail
    ) {
      // throw new Error("Payment details mismatch");
      // console.log(
      //   transactionAmount,
      //   transactionStatus,
      //   transactionEmail,
      //   transactionStatus,
      // );
      return {
        ok: false,
        reason: "Payment details mismatch or payment failed",
      };
    }

    return {
      ok: true,
      reference: data.data.reference,
      amount: data.data.amount,
      currency: data.data.currency,
      paidAt: data.data.paidAt || data.data.paid_at,
      customerEmail: data.data.customer.email,
      gatewayResponse: data.data.gateway_response,
      transactionStatus: data.data.status,
    };
  },
});
