import { api } from "../../lib/axios";

function fileKindFromType(message_type) {
  if (message_type === "video") return "video";
  if (message_type === "image") return "image";
  return null;
}

function normalizeMessage(message = {}) {
  return {
    id: message.id,
    senderId: message.sender_id,
    senderName: message.sender_name,
    text: message.content || "",
    stage: message.verification_stage || null,
    filePath: message.file_url || null,
    fileKind: fileKindFromType(message.message_type),
    createdAt: message.created_at,
  };
}

export const chatApi = {
  async createFromConnection(connectionId) {
    const { data } = await api.post("/chats", { connection_id: connectionId });
    return { chat: data };
  },

  async messages(chatId) {
    const { data } = await api.get(`/chats/${chatId}/messages`);
    return { chatId, messages: data.map(normalizeMessage) };
  },

  async sendMessage(chatId, { content, verificationStage, file } = {}) {
    const formData = new FormData();

    if (content) formData.append("content", content);
    if (verificationStage) formData.append("verification_stage", verificationStage);
    if (file) formData.append("file", file);

    const { data } = await api.post(`/chats/${chatId}/messages`, formData);
    return { message: normalizeMessage(data) };
  },
};
