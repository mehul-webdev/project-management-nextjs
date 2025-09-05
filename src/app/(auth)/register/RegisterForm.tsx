"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { showToast } from "@/store/toastSlice";
import { toast } from "sonner";
import GoogleLoginButton from "../GoogleLoginButton";

const RegisterForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleUserRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", { email, password });
      dispatch(login(res.data.user));
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
      toast.error("Error", {
        description: error.response?.data?.message || error.message,
        closeButton: true,
      });
    }
  };

  return (
    <form onSubmit={handleUserRegister} className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to register your account
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          Register
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <GoogleLoginButton authState="Register" />
      </div>

      <div className="text-center text-sm">
        Already Registered?&nbsp;
        <Link href="/login" className="underline underline-offset-4">
          Log In
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
