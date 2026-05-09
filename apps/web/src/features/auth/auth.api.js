export const authApi = {
  async login(payload) {
    return {
      token: "mock-token",
      user: {
        id: "u_001",
        name: "Amara Johnson",
        email: payload.email || "amara@example.com",
        role: "user",
        verificationStatus: "verified",
        ratingAverage: 4.8,
        ratingCount: 23,
      },
    };
  },

  async signup(payload) {
    return {
      token: "mock-token",
      user: {
        id: "u_002",
        name: payload.name || "Pending User",
        email: payload.email || "pending@example.com",
        role: "user",
        verificationStatus: "pending_verification",
        ratingAverage: null,
        ratingCount: 0,
      },
    };
  },

  async me() {
    return null;
  },
};
