"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

import { useMutation } from "convex/react";
import { api } from "@wazo/convex-api/api";

import { useUser } from "@clerk/nextjs"; // ✅ Add this import
import { toast } from "sonner";


const PetAdSchema = z.object({
  animalType: z.string().min(1, "Animal type is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.string().min(1, "Age is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  images: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one image"),
  name: z.string().min(1, "Your name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
});

export default function PostPetAdPage() {
  const { user } = useUser(); // ✅ Add this hook

  const form = useForm({
    resolver: zodResolver(PetAdSchema),
    defaultValues: {
      animalType: "",
      breed: "",
      age: "",
      price: "",
      description: "",
      images: [],
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const generateUploadUrl = useMutation(api.functions.upload.generateUploadUrl);
  const getImageUrl = useMutation(api.functions.upload.getImageUrl);
  const createPostAd = useMutation(api.functions.ads.createPostAd);

  async function uploadImages(files: File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Step 1: get URL from backend
      const url = await generateUploadUrl();

      // Step 2: upload file to Convex storage
      const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      // Step 3: convert to public URL
      const fileUrl = await getImageUrl({ storageId });

      uploadedUrls?.push(fileUrl || "");
    }

    return uploadedUrls || [];
  }

  const onSubmit = async (values: any) => {
    console.log(values, "this is the values of the form");
    if (!user?.id) {
      toast.success("Please sign in to post an ad");
      return;
    }
    const files = values.images; // array of File
    const uploadedImageUrls = await uploadImages(files);
    console.log(user?.id, "this is the user id");
    await createPostAd({
      userId: user?.id,
      animalType: values.animalType,
      breed: values.breed,
      age: Number(values.age),
      price: Number(values.price),
      description: values.description,
      images: uploadedImageUrls,
      sellerName: values.name,
      sellerEmail: values.email,
      sellerPhone: values.phone,
      sellerCity: values.city,
      sellerState: values.state,
      sellerAddress: values.address,
    });

    // ✅ Reset the form
    form.reset({
      animalType: "",
      breed: "",
      age: "",
      price: "",
      description: "",
      images: [],
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    });

    // ❗ Reset file input manually
    const imageInput =
      document.querySelector<HTMLInputElement>("#image-upload");
    if (imageInput) {
      imageInput.value = "";
    }

    alert("Pet ad posted!");
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <Card className="max-w-2xl w-full shadow-lg p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700">
            Post A New Pet Ad
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4">Pet Details</h2>

                <FormField
                  control={form.control}
                  name="animalType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Animal Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dog, Cat, Bird" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Golden Retriever, Siamese"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Age (in years)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 150" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Tell us about the pet..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Pet Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            field.onChange(files);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <hr className="my-6" />

              <div>
                <h2 className="text-lg font-semibold mb-4">Contact Details</h2>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., jane.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., +123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City / State / Zip / Country */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="my-2">
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
                    <FormItem className="my-2">
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
                            <SelectItem value="Abuja">Abuja</SelectItem>
                            <SelectItem value="Kano">Kano</SelectItem>
                            <SelectItem value="Rivers">Rivers</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-green-600 text-white"
              >
                Post Ad
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
