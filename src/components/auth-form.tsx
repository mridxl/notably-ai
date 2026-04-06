"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { type FormEvent } from "react";
import Image from "next/image";
import { login, signInWithGoogle, signup } from "@/app/(auth)/actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { motion } from "framer-motion";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const router = useRouter();
  const isLoginForm = type === "login";
  const [isPending, startTransition] = React.useTransition();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      if (result.error) {
        toast.error("Failed to initialize Google sign-in");
        return;
      }
      if (result.url) {
        window.open(result.url, "_self");
        return;
      } else {
        toast.error("No redirect URL provided");
      }
    } catch {
      toast.error("Failed to initialize Google sign-in");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const schema = isLoginForm ? loginSchema : registerSchema;

    const validation = schema.safeParse({ email, password });
    if (!validation.success) {
      const errorMessage = validation.error.errors[0]!.message;
      toast.error(errorMessage);
      return;
    }

    startTransition(async () => {
      const action = isLoginForm ? login : signup;
      const { error } = await action(formData);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success(
        type === "login"
          ? "Logged in successfully. Welcome back!"
          : "Registered successfully. Welcome aboard!",
      );
      router.push("/notes");
    });
  };

  return (
    <motion.div
      className="flex flex-col gap-6"
      key={type}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/logo.png"
              alt="Notes"
              width="48"
              height="48"
              className="mb-1 rounded-md"
            />
            <span className="sr-only">Notes</span>
            <h1 className="text-xl font-bold">Welcome to Notes</h1>
            <div className="text-center text-sm">
              {type === "login" ? (
                <span>
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-primary underline">
                    Register
                  </Link>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary underline">
                    Login
                  </Link>
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
              />
            </div>
            <Button type="submit" className="w-full">
              {isPending
                ? type === "login"
                  ? "Logging in..."
                  : "Registering..."
                : type === "login"
                  ? "Login"
                  : "Register"}
            </Button>
          </div>
          <div className="after:border-foreground/80 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <Button className="w-full" type="button" onClick={handleGoogleSignIn}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
