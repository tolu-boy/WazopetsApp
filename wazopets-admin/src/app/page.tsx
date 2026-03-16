"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * ✅ Redirect already signed-in users
   */
  useEffect(() => {
    if (isUserLoaded && isSignedIn) {
      router.replace("/admin");
    }
  }, [isUserLoaded, isSignedIn, router]);

  /**
   * ✅ Correct Clerk password sign-in flow
   */
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!isSignInLoaded) return;

  //   setIsLoading(true);
  //   setError("");

  //   try {
  //     const result = await signIn.create({
  //       identifier: email,
  //     });

  //     if (result.status === "needs_first_factor") {
  //       const completed = await signIn.attemptFirstFactor({
  //         strategy: "password",
  //         password,
  //       });

  //       if (completed.status === "complete") {
  //         await setActive({
  //           session: completed.createdSessionId,
  //         });

  //         router.replace("/admin");
  //       } else {
  //         setError("Unable to complete sign in.");
  //       }
  //     }
  //   } catch (err: any) {
  //     console.error("Sign-in error:", err);
  //     setError(err.errors?.[0]?.message || "Invalid email or password");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit= async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignInLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });
        // router.replace("/admin");
      } else {
        setError("Unable to complete sign in.");
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError(err.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };




  /**
   * ⏳ Prevent flash before redirect
   */
  if (!isUserLoaded || !isSignInLoaded) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-sm border-gray-200">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="mb-6 flex flex-row items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
              <span className="text-white font-bold">🐾</span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-gray-900">WazoPets</h1>
              <p className="text-xs text-gray-500 font-medium">
                Nigeria&apos;s #1 Pet Store
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Securely log in to your admin account.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@wazopets.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" disabled={isLoading} />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
