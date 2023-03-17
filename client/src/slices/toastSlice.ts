import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastOptions } from 'react-toastify';
import type { RootState } from '../app/store';

// Define a type for the slice state
interface ToastState {
  page: string | null;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string | undefined;
  options?: ToastOptions;
}

// Define the initial state using that type
const initialState: ToastState = {
  page: null,
  type: 'info',
  message: undefined,
  options: { autoClose: 2000 },
};

export const toastSlice = createSlice({
  name: 'toast',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastState>) => {
      state.page = action.payload.page;
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.options = {
        ...state.options,
        ...action.payload.options,
      };
    },
    closeToast: () => {
      return initialState;
    },
  },
});

export const { showToast, closeToast } = toastSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectToast = (state: RootState) => state.toast;

export default toastSlice.reducer;
