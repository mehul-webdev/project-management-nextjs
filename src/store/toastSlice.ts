import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastVariant = "success" | "error" | "info" | "warning" | "loading";

type ToastState = {
  show: boolean;
  title: string;
  description?: string;
  showCloseIcon: boolean;
  state?: ToastVariant;
};

const initialState = {
  show: false,
  title: "",
  description: "",
  showCloseIcon: true,
  state: "success",
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { showToast } = toastSlice.actions;

export default toastSlice.reducer;
