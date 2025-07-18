import { RootState } from "@/redux/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string; // Optional role field
  [key: string]: unknown; // Allow additional dynamic properties
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: unknown;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

const authslice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticateUser(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    authenticateUserFailed(state, action: PayloadAction<{ error: string }>) {
      state.isAuthenticated = false;
      state.error = action.payload.error;
    },
  },
});

export const { authenticateUser, authenticateUserFailed, logoutUser } =
  authslice.actions;

export default authslice.reducer;

export const useCurrentUser = (state: RootState) => state.auth.user;
