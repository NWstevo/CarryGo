export const chatApi = {
  list: async () => ({ chats: [] }),
  messages: async (connectionId) => ({ connectionId, messages: [] }),
  sendMessage: async (connectionId, payload) => ({
    message: {
      id: crypto.randomUUID(),
      connectionId,
      createdAt: new Date().toISOString(),
      ...payload,
    },
  }),
};
