"use client";

import { FormSelect } from "@/app/components/clientComponents/FormSelect";
import { USER_ROLES } from "@/app/constants";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { updateUserDetails } from "@/store/authSlice";
import { showToast } from "@/store/toastSlice";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import z from "zod";

const updateProfileSchema = z.object({
  role: z.string().nonempty("Role is required"),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

const UpdateProfileForm = () => {
  const dispatch = useDispatch();
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onTouched",
    defaultValues: { role: "" },
  });

  const onSubmit = async (data: UpdateProfileFormValues) => {
    try {
      // Send role to backend

      const res = await api.patch("/user/update-role", data);

      dispatch(updateUserDetails(res.data.user));
      dispatch(
        showToast({
          title: "Registered Successfully",
          description: "Welcome aboard! Let's start managing projects.",
          showCloseIcon: true,
          state: "success",
          show: true,
        })
      );

      // Redirect user to dashboard after successful role update
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          title: "Error",
          description: "Please try again",
          showCloseIcon: true,
          state: "error",
          show: true,
        })
      );
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6")}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Update Your Profile</h1>
          <p className="text-muted-foreground text-sm">
            Please select your role to continue
          </p>
        </div>

        <div className="grid gap-6">
          <FormSelect
            control={form.control}
            name="role"
            label="Select Role"
            placeholder="Choose your role"
            options={USER_ROLES}
            groupLabel="Roles"
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
