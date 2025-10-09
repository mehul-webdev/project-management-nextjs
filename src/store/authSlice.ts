import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      state.user = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUserDetails: (state, action: PayloadAction<User>) => {
      console.log("[updateUserDetails] Updating user details:", action.payload); // ✅ log here
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, updateUserDetails } = authSlice.actions;
export default authSlice.reducer;
