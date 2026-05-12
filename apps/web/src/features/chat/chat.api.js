import { api } from "../../lib/axios";

export const chatApi = {
  list: async () => ({ chats: [] }),

  async createFromConnection(connectionId) {
    const { data } = await api.post("/chats", { connection_id: connectionId });
    return { chat: data };
  },

  async messages(chatId) {
    const { data } = await api.get(`/chats/${chatId}/messages`);
    return { chatId, messages: data };
  },

  async sendMessage(chatId, payload) {
    const { data } = await api.post(`/chats/${chatId}/messages`, payload);
    return { message: data };
  },
};
