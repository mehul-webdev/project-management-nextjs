"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";

export default function AuthLoading() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        dispatch(login(res.data.user));
        router.replace("/dashboard");
      } catch {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [dispatch, router]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <p>Loading....</p>
    </div>
  );
}
