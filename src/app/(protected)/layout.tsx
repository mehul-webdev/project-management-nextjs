"use client";

import { useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toastData = useSelector((state: RootState) => state.toast);

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
        `${title}`,
        {
          description,
          closeButton: showCloseIcon,
        }
      );
    }
  }, [toastData]);

  return <Layout>{children}</Layout>;
}
