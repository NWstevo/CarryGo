import { api } from "../../lib/axios";

export const usersApi = {
  async verify() {
    const { data } = await api.post("/users/me/verification");
    return { verificationStatus: data.verification_status };
  },
};
