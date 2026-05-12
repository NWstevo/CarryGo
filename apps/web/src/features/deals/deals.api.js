import { api } from "../../lib/axios";

function normalizeDeal(deal = {}) {
  return {
    ...deal,
    origin: deal.trip_origin || deal.origin || "Linked listing",
    destination: deal.trip_destination || deal.destination || "Destination",
    item: deal.item_name || deal.item || "Package",
    budget: deal.budget ?? "—",
    senderId: deal.sender_id,
    travelerId: deal.traveler_id,
  };
}

export const dealsApi = {
  async list() {
    const { data } = await api.get("/deals");
    return { deals: data.map(normalizeDeal) };
  },

  async create(connectionId) {
    const { data } = await api.post("/deals", { connection_id: connectionId });
    return { deal: normalizeDeal(data) };
  },

  async updateStatus(dealId, status) {
    const { data } = await api.patch(`/deals/${dealId}/status`, { status });
    return { deal: normalizeDeal(data) };
  },
};
