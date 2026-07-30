import { create } from "zustand";
import { storage } from "../../lib/storage";

const savedSession = storage.get("auth", { user: null, token: null });

export const useAuthStore = create((set) => ({
  user: savedSession.user,
  token: savedSession.token,

  setSession: ({ user, token }) => {
    storage.set("auth", { user, token });
    set({ user, token });
  },

  logout: () => {
    storage.remove("auth");
    set({ user: null, token: null });
  },
}));
