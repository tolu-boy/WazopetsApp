import { httpAction } from "../_generated/server";
import { Webhook } from "svix";
import { api } from "../_generated/api";

type ClerkEmail = { id: string; email_address: string };
type ClerkUserPayload = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmail[];
};
// const existing = await ctx.runQuery(api.users.getByClerkId, { clerkId });

export const clerkWebhook = httpAction(async (ctx, req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const payload = await req.text();
  let evt: { type: string; data: ClerkUserPayload };

  try {
    const webhook = new Webhook(secret);
    evt = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as any;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  const clerkId = data.id;
  const first = data.first_name ?? "";
  const last = data.last_name ?? "";
  const fullName = [first, last].filter(Boolean).join(" ").trim();
  const primaryId = data.primary_email_address_id ?? undefined;
  const emails = data.email_addresses ?? [];
  const primaryEmail =
    (primaryId && emails.find((e) => e.id === primaryId)?.email_address) ||
    emails[0]?.email_address ||
    "";

  const existing = await ctx.runQuery(api.functions.users.getByClerkId, {
    clerkId,
  });

  if (type === "user.created" || type === "user.updated") {
    if (!existing) {
      await ctx.runMutation(api.functions.users.insert, {
        clerkId,
        email: primaryEmail,
        name: fullName || undefined,
      });
    } else {
      await ctx.runMutation(api.functions.users.patch, {
        id: existing._id,
        email: primaryEmail,
        name: fullName || undefined,
      });
    }
  } else if (type === "user.deleted") {
    if (existing) {
      await ctx.runMutation(api.functions.users.deleteById, {
        id: existing._id,
      });
      // If you add user-owned data later, cascade deletes here via more runMutations.
    }
  }

  return new Response(null, { status: 200 });
});
