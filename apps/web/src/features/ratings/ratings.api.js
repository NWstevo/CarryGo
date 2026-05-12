import { api } from "../../lib/axios";

export const ratingsApi = {
  async list(userId) {
    if (!userId) return { ratings: [] };

    const { data } = await api.get(`/ratings/users/${userId}`);
    return { ratings: data };
  },

  async create(payload) {
    const { data } = await api.post("/ratings", {
      deal_id: payload.deal_id || payload.dealId,
      rated_user_id: payload.rated_user_id || payload.ratedUserId,
      score: payload.score,
      comment: payload.comment,
    });

    return { rating: data };
  },
};
