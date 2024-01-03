import { create } from "zustand";
import { PersistStorage, persist } from "zustand/middleware";

type authState = {
  auth: string;
};

type authActions = {
  setAuth: (auth: string) => void;
};


const storage: PersistStorage<authState & authActions> = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name) => localStorage.removeItem(name),
};
export const useAuthStore = create(
  persist<authState & authActions>(
    (set) => ({
      auth: "",
      setAuth: (auth) => set({ auth }),
    }),
    {
      name: "auth-store", // Name to identify the local storage entry
      storage , // Use localStorage
       
    }
  )
);
