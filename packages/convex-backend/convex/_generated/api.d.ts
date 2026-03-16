/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_emails from "../actions/emails.js";
import type * as actions_payments from "../actions/payments.js";
import type * as actions_paystack from "../actions/paystack.js";
import type * as functions__generated_api from "../functions/_generated/api.js";
import type * as functions__generated_server from "../functions/_generated/server.js";
import type * as functions_ads from "../functions/ads.js";
import type * as functions_cart from "../functions/cart.js";
import type * as functions_categories from "../functions/categories.js";
import type * as functions_checkout from "../functions/checkout.js";
import type * as functions_clerkWebhook from "../functions/clerkWebhook.js";
import type * as functions_order from "../functions/order.js";
import type * as functions_payments from "../functions/payments.js";
import type * as functions_paystackWebhook from "../functions/paystackWebhook.js";
import type * as functions_products from "../functions/products.js";
import type * as functions_upload from "../functions/upload.js";
import type * as functions_users from "../functions/users.js";
import type * as http from "../http.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/emails": typeof actions_emails;
  "actions/payments": typeof actions_payments;
  "actions/paystack": typeof actions_paystack;
  "functions/_generated/api": typeof functions__generated_api;
  "functions/_generated/server": typeof functions__generated_server;
  "functions/ads": typeof functions_ads;
  "functions/cart": typeof functions_cart;
  "functions/categories": typeof functions_categories;
  "functions/checkout": typeof functions_checkout;
  "functions/clerkWebhook": typeof functions_clerkWebhook;
  "functions/order": typeof functions_order;
  "functions/payments": typeof functions_payments;
  "functions/paystackWebhook": typeof functions_paystackWebhook;
  "functions/products": typeof functions_products;
  "functions/upload": typeof functions_upload;
  "functions/users": typeof functions_users;
  http: typeof http;
  seed: typeof seed;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
