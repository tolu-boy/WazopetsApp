"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutSchema } from "@/schema/checkoutSchema.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Mail, Phone, MapPin } from "lucide-react";
import OrderSummary from "@/components/orderSummary";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation"; // ✅ add this
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@wazo/convex-api/api";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CheckOutPage() {
  const { getSubtotal, getTax, getDiscount, getShipping, getTotal } =
    useCartStore();

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      //   zipCode: "",
      //   country: "Nigeria",
      //   billingAddressSame: true,
      termsAgreed: false,
    },
  });

  const { user } = useUser();
  const profile = useQuery(
    api.functions.checkout.getProfile,
    user?.id ? { clerkId: user.id } : "skip",
  );

  const upsertProfile = useMutation(api.functions.checkout.upsertProfile);
  useEffect(() => {
    if (!profile) return;
    form.reset({
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      address: profile.address ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      termsAgreed: true,
    });
  }, [profile]);

  const verifyPayment = useAction((api as any).actions.payments.verify as any);
  const cartItems = useQuery(
    api.functions.cart.getCartItems,
    user?.id ? { userId: user.id } : "skip",
  );
  const createPendingOrder = useMutation(api.functions.order.createPending);
  const finalizeOrder = useMutation(api.functions.order.finalizePayment);
  const pendingOrderRef = useRef<{
    orderId: string;
    paystackReference: string;
    amountKobo: number;
    currency: string;
  } | null>(null); // keep server totals/reference without relying on React state

  const onSuccess = async (reference: any, pendingOrder: any) => {
    // console.log(reference, "this is the refrence payment now");
    try {
      // Verify Paystack transaction first
      const verifyResult = await verifyPayment({
        reference: reference.reference,
        expectedAmountKobo: pendingOrder.amountKobo,
        email: profile?.email,
      });

      console.log(verifyResult, "this is verify Result");

      if (verifyResult?.ok !== true) {
        toast.error(verifyResult?.reason || "Payment not verified");
        return;
      }

      if (!user?.id) {
        console.log("no user found");
        return;
      }

      // console.log(cartItems, "this is cartItems");

      // Finalize the pending order on the server by reference
      const orderRes = await finalizeOrder({
        paystackReference: verifyResult?.reference,
        paystackAmountKobo: verifyResult?.amount,
        currency: verifyResult?.currency,
        transactionStatus: verifyResult?.transactionStatus,
      });

      // console.log("✅ Order created:", orderRes.orderId);

      // Clear local cart (client side) only after paid
      if (orderRes.paymentStatus === "paid") {
        useCartStore.getState().clearCart();
      }

      // Redirect to success page
      router.replace(`/order-success?orderId=${orderRes.orderId}`);
    } catch (err) {
      console.error("❌ Error completing checkout:", err);
      toast.error("Error completing checkout");
    }
  };

  // you can call this function anything
  const onClose = async (reference: any) => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed", reference);
  };

  const onSubmit = async (values: CheckoutSchema) => {
    if (!user?.id) return;
    await upsertProfile({
      clerkId: user.id,
      email: values.email,
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      address: values.address,

      // addressLine1: values.addressLine1,
      // addressLine2: values.addressLine2,
      city: values.city,
      state: values.state,
    });

    // 3️⃣ Initialize payment safely inside client context
    // Create a pending order with server-authoritative totals before launching Paystack
    const pending = await createPendingOrder({
      userId: user.id,
      shippingAddress: `${values.address}, ${values.city}, ${values.state}`,
    });
    pendingOrderRef.current = pending as any;

    // 3️⃣ Initialize payment safely inside client context using server numbers
    if (typeof window !== "undefined") {
      const { usePaystackPayment } = await import("react-paystack");
      const config = {
        reference: pending.paystackReference,
        email: profile?.email,
        amount: pending.amountKobo, // already in kobo from server
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        currency: pending.currency,
      };
      const initializePayment = usePaystackPayment(config);

      const onSuccessWithPending = (reference: any) =>
        onSuccess(reference, pending);

      initializePayment({
        onSuccess: onSuccessWithPending,
        onClose,
      });
    }
  };

  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
        Loading checkout, please login or register before checkout...
      </div>
    );
  }
  if (!isSignedIn) {
    // 👇 Render the Clerk redirect component
    return <RedirectToSignIn redirectUrl="/checkout" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                  placeholder="you@example.com"
                                  {...field}
                                  className="pl-10"
                                  type="email"
                                  disabled
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                  placeholder="+234 800 123 4567"
                                  {...field}
                                  className="pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Address Section */}

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="my-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Where are you at..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 
                
                    {/* City / State / Zip / Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Lagos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                // defaultValue={field.value}
                                value={field.value} // <-- controlled
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Lagos">Lagos</SelectItem>
                                  {/* <SelectItem value="Abuja">Abuja</SelectItem>
                                  <SelectItem value="Kano">Kano</SelectItem>
                                  <SelectItem value="Rivers">Rivers</SelectItem> */}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAgreed"
                      render={({ field }) => (
                        <FormItem className="">
                          <div className="flex items-start space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm">
                              I agree to the{" "}
                              <a
                                href="#"
                                className="text-blue-600 hover:underline"
                              >
                                Terms & Conditions
                              </a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Complete Order
                    </Button>
                  </form>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/cart")}
                    className="w-full my-3"
                    //   className="w-full py-3 my-4 px-4 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    Back to Cart
                  </Button>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Order Summary */}
          <OrderSummary
            getSubtotal={getSubtotal}
            getTax={getTax}
            getDiscount={getDiscount}
            getShipping={getShipping}
            getTotal={getTotal}
            onProceed={() => form.handleSubmit(onSubmit)()}
          />
        </div>
      </div>
    </div>
  );
}
