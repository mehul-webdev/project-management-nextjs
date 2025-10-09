"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { login } from "@/store/authSlice";
import { showToast } from "@/store/toastSlice";
import GoogleLoginButton from "../GoogleLoginButton";
import { FormInput } from "@/app/components/clientComponents/FormInput";
import { FormSelect } from "@/app/components/clientComponents/FormSelect";
import { USER_ROLES } from "@/app/constants";

// ✅ Zod Schema for Validation
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  role: z.string().nonempty("Role is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Za-z]/, "Password must contain letters")
    .regex(/\d/, "Password must contain numbers"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  // ✅ Initialize React Hook Form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched", // ✅ Trigger validation when inputs are touched
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    },
  });

  // ✅ Submit handler
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", data);

      dispatch(login(res.data.user));
      dispatch(
        showToast({
          title: "Registered Successfully",
          description: "Welcome aboard! Let's start managing projects.",
          showCloseIcon: true,
          state: "success",
          show: true,
        })
      );

      router.push("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error("Registration Failed", {
        description: error.response?.data?.message || error.message,
        closeButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6")}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details to register and get started.
          </p>
        </div>

        {/* Name Fields */}
        <div className="flex flex-col gap-6 md:flex-row">
          <FormInput
            control={form.control}
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
          />

          <FormInput
            control={form.control}
            name="lastName"
            label="Last Name"
            placeholder="Enter your last name"
          />
        </div>

        <FormSelect
          control={form.control}
          name="role"
          label="Select Role"
          placeholder="Choose your role"
          options={USER_ROLES}
          groupLabel="Roles"
        />

        {/* Email Field */}
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          placeholder="m@example.com"
          type="email"
        />

        {/* Password Field */}
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          placeholder="••••••••"
          type="password"
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>

        {/* Divider */}
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t">
          <span className="bg-background relative z-10 px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        {/* Social Login */}
        <GoogleLoginButton authState="Register" />

        {/* Footer */}
        <div className="text-center text-sm">
          Already registered?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Log in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
