import { api } from "../../lib/axios";

function normalizeUser(user = {}) {
  return {
    id: user.id,
    name: user.name || user.full_name || user.email || "CarryGo user",
    fullName: user.full_name || user.name || "",
    email: user.email,
    role: user.role || "user",
    verificationStatus: user.verification_status || user.verificationStatus || "verified",
    ratingAverage: user.rating_average ?? user.ratingAverage ?? null,
    ratingCount: user.rating_count ?? user.ratingCount ?? 0,
  };
}

export const authApi = {
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);

    return {
      token: data.token,
      user: normalizeUser(data.user),
    };
  },

  async signup(payload) {
    await api.post("/auth/signup", {
      full_name: payload.full_name || payload.name,
      email: payload.email,
      password: payload.password,
    });

    return authApi.login({
      email: payload.email,
      password: payload.password,
    });
  },

  async me() {
    const { data } = await api.get("/users/me");
    return normalizeUser(data.user);
  },
};
