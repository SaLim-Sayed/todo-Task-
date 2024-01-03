import { create } from "zustand";
import { PersistStorage, persist } from "zustand/middleware";
type User = {
  name: string;
  email: string;
  token: string;
  _id: string;
  about?: string;
  username?: string;
  answer?: string;
  image?: { url: string; public_id: string }| any;
};
type UserState = {
  user: User|null;
};

type UserActions = {
  setUser: (user: User) => void;
};

const storage: PersistStorage<UserState & UserActions> = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name) => localStorage.removeItem(name),
};
export const useUserStore = create(
  persist<UserState & UserActions>(
    (set) => ({
      user: {
        name: "",
        email: "",
        token:"",
        _id: "",
        about: "",
        username: "",
        answer: "",
        image: { url: "", public_id: "" },
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-store", // Name to identify the local storage entry
      storage , // Type assertion here
     
    }
  )
);

export default useUserStore;
