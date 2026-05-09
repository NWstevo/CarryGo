export const tripsApi = {
  list: async () => ({ trips: [] }),
  detail: async (tripId) => ({ trip: null, tripId }),
  create: async (payload) => ({ trip: { id: crypto.randomUUID(), ...payload } }),
  requestConnection: async (tripId, payload) => ({
    connection: { id: crypto.randomUUID(), tripId, status: "pending", ...payload },
  }),
};
