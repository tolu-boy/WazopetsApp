/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ads from "../ads.js";
import type * as cart from "../cart.js";
import type * as checkout from "../checkout.js";
import type * as clerkWebhook from "../clerkWebhook.js";
import type * as order from "../order.js";
import type * as payments from "../payments.js";
import type * as paystackWebhook from "../paystackWebhook.js";
import type * as products from "../products.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ads: typeof ads;
  cart: typeof cart;
  checkout: typeof checkout;
  clerkWebhook: typeof clerkWebhook;
  order: typeof order;
  payments: typeof payments;
  paystackWebhook: typeof paystackWebhook;
  products: typeof products;
  upload: typeof upload;
  users: typeof users;
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
