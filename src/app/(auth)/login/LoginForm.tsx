"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { login } from "@/store/authSlice";
import { toast } from "sonner";
import { showToast } from "@/store/toastSlice";
import GoogleLoginButton from "../GoogleLoginButton";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.status === 200) {
        dispatch(login());
      }
      dispatch(
        showToast({
          title: "Login Successfully",
          description: "Please complete your tasks on time.",
          showCloseIcon: true,
          state: "success",
          show: true,
        })
      );
      router.push("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error("Login failed", {
        description: error.response?.data?.message || error.message,
        closeButton: true,
      });
    }
  };

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={handleLogin}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <GoogleLoginButton authState="Login" />
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
