import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

// Define a type for the slice state
interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    authPending: (state) => {
      state.isLoading = true;
    },
    authSuccess: (state) => {
      state.isLoading = false;
      state.isAuthenticated = true;
    },
    authFai: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { authPending, authSuccess, authFai, logout } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;
