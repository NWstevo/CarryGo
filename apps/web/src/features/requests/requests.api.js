export const requestsApi = {
  list: async () => ({ requests: [] }),
  detail: async (requestId) => ({ request: null, requestId }),
  create: async (payload) => ({ request: { id: crypto.randomUUID(), ...payload } }),
  offerConnection: async (requestId, payload) => ({
    connection: { id: crypto.randomUUID(), requestId, status: "pending", ...payload },
  }),
};
