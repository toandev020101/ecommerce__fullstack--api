import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

// Define a type for the slice state
interface GlobalState {
  mode: 'light' | 'dark';
  isReload: boolean;
}

// Define the initial state using that type
const initialState: GlobalState = {
  mode: 'light',
  isReload: false,
};

export const globalSlice = createSlice({
  name: 'global',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setIsReload: (state) => {
      state.isReload = !state.isReload;
    },
  },
});

export const { setMode, setIsReload } = globalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMode = (state: RootState) => state.global.mode;
export const selectIsReload = (state: RootState) => state.global.isReload;

export default globalSlice.reducer;
