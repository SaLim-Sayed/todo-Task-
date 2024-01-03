import { create } from "zustand";
import { LoaderActions, LoaderState } from "../types/LoaderTypes";

// Define the initial state
const initialState: LoaderState = {
  loading: false,
};

// Define the store using Zustand's create function
export const useLoaderStore = create<LoaderState & LoaderActions>((set) => ({
  ...initialState,
  showLoading: (loading) => {
    set({
      loading,
    });
  } 
}));
