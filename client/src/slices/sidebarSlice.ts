import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

// Define a type for the slice state
interface SidebarState {
  isOpenSidebar: boolean;
}

// Define the initial state using that type
const initialState: SidebarState = {
  isOpenSidebar: true,
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setOpenSidebar: (state) => {
      state.isOpenSidebar = !state.isOpenSidebar;
    },
  },
});

export const { setOpenSidebar } = sidebarSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsOpenSidebar = (state: RootState) => state.sidebar.isOpenSidebar;

export default sidebarSlice.reducer;
