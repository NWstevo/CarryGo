export const connectionsApi = {
  list: async () => ({ connections: [] }),
  accept: async (connectionId) => ({ connection: { id: connectionId, status: "accepted" } }),
  reject: async (connectionId) => ({ connection: { id: connectionId, status: "rejected" } }),
};
