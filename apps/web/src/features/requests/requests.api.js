import { api } from "../../lib/axios";

function normalizeRequest(request = {}) {
  return {
    ...request,
    targetDestination: request.destination || request.targetDestination,
    targetDate: request.target_date || request.targetDate,
    item: request.item_name || request.item,
    itemWeight: request.item_weight ?? request.itemWeight,
    sender: {
      id: request.sender_id,
      name: request.sender_name || "Sender",
      ratingAverage: request.rating_average ?? null,
    },
  };
}

export const requestsApi = {
  async list() {
    const { data } = await api.get("/requests");
    return { requests: data.map(normalizeRequest) };
  },

  async detail(requestId) {
    const { requests } = await requestsApi.list();
    return {
      request: requests.find((request) => request.id === requestId) || null,
      requestId,
    };
  },

  async create(payload) {
    const { data } = await api.post("/requests", {
      origin: payload.origin,
      destination: payload.destination,
      target_date: payload.target_date || payload.targetDate,
      item_name: payload.item_name || payload.item,
      item_weight: payload.item_weight || payload.itemWeight,
      budget: payload.budget,
    });

    return { request: normalizeRequest(data) };
  },

  async offerConnection(requestId, payload = {}) {
    const { data } = await api.post(`/connections/requests/${requestId}`, {
      message: payload.message,
    });

    return { connection: data };
  },
};
