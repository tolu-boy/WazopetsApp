import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address Line 1 is required"),
  // addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  //   zipCode: z.string().optional(),
  //   country: z.string().min(2, "Country is required"),
  //   billingAddressSame: z.boolean().optional().default(true),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Conditions",
  }),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
