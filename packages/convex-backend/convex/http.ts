import { httpRouter } from "convex/server";
import { clerkWebhook } from "./functions/clerkWebhook";
import { paystackWebhook } from "./functions/paystackWebhook";

const http = httpRouter();

http.route({
  path: "/clerkWebhook",
  method: "POST",
  handler: clerkWebhook,
});

http.route({
  path: "/paystack-webhook",
  method: "POST",
  handler: paystackWebhook,
});

export default http;
