"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { updateUserDetails } from "@/store/authSlice";
import ProtectedLayoutUi from "../components/layout/ProtectedLayout";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const IS_INITIAL = useRef(true);
  const dispatch = useDispatch();
  const toastData = useSelector((state: RootState) => state.toast);

  // show toasts
  useEffect(() => {
    const {
      title,
      description,
      showCloseIcon,
      state: toastState,
      show,
    } = toastData;

    if (show) {
      toast[toastState as "success" | "error" | "info" | "warning" | "loading"](
        title,
        {
          description,
          closeButton: showCloseIcon,
        }
      );
    }
  }, [toastData]);

  const handlegetUserData = useCallback(async () => {
    try {
      const response = await api.get("/api/user/");
      const userData = response.data;

      dispatch(updateUserDetails(userData.user));
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error("Error", {
        description: error.response?.data?.message || error.message,
        closeButton: true,
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (!IS_INITIAL.current) {
      return;
    }

    IS_INITIAL.current = false;

    handlegetUserData();
  }, [handlegetUserData]);

  return <ProtectedLayoutUi>{children}</ProtectedLayoutUi>;
}
