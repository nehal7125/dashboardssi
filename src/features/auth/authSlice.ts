import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  user: null | { authToken: string };
  role: null | string;
  isInitializing: boolean; // New state for initial auth check
  isSigningIn: boolean; // New state for sign in process
  error: null | string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  isInitializing: true,
  isSigningIn: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuthStart: (state) => {
      state.isInitializing = true;
      state.error = null;
    },
    initializeAuthComplete: (state) => {
      state.isInitializing = false;
    },
    signInStart: (state) => {
      state.isSigningIn = true;
      state.error = null;
    },
    signInSuccess: (state, action: PayloadAction<{ authToken: string; role: null | string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.role = action.payload.role;
      state.isSigningIn = false;
      state.isInitializing = false;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.isSigningIn = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.isInitializing = false;
      localStorage.removeItem('role');
      localStorage.removeItem('authToken');
      localStorage.removeItem('preferred_timezone');
      localStorage.removeItem('username');
    },
  },
});

export const { initializeAuthStart, initializeAuthComplete, signInStart, signInSuccess, signInFailure, signOut } =
  authSlice.actions;

export default authSlice.reducer;
