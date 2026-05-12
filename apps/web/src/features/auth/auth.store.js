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

  loginAsUser: () =>
    set({
      user: {
        id: "u_001",
        name: "Amara Johnson",
        email: "amara@example.com",
        role: "user",
        verificationStatus: "verified",
        ratingAverage: 4.8,
        ratingCount: 23,
      },
      token: null,
    }),

  loginAsPendingUser: () =>
    set({
      user: {
        id: "u_002",
        name: "Pending User",
        email: "pending@example.com",
        role: "user",
        verificationStatus: "pending_verification",
        ratingAverage: null,
        ratingCount: 0,
      },
      token: null,
    }),

  loginAsAdmin: () =>
    set({
      user: {
        id: "admin_001",
        name: "Admin User",
        email: "admin@carrygo.com",
        role: "admin",
        verificationStatus: "verified",
        ratingAverage: null,
        ratingCount: 0,
      },
      token: null,
    }),

  logout: () => {
    storage.remove("auth");
    set({ user: null, token: null });
  },
}));
