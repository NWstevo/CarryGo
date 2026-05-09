import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: {
    id: "u_001",
    name: "Amara Johnson",
    email: "amara@example.com",
    role: "user",
    verificationStatus: "verified",
    ratingAverage: 4.8,
    ratingCount: 23,
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
    }),

  logout: () => set({ user: null }),
}));
