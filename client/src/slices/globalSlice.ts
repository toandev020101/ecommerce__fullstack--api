import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

// Define a type for the slice state
interface GlobalState {
  mode: 'light' | 'dark';
}

// Define the initial state using that type
const initialState: GlobalState = {
  mode: 'light',
};

export const globalSlice = createSlice({
  name: 'global',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setMode } = globalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMode = (state: RootState) => state.global.mode;

export default globalSlice.reducer;
