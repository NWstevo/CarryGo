import { api } from "../../lib/axios";

function normalizeConnection(connection = {}, direction = "sent") {
  const listingTitle = connection.trip_id
    ? `Trip connection ${connection.trip_id.slice(0, 8)}`
    : `Request connection ${connection.request_id?.slice(0, 8) || ""}`;

  return {
    ...connection,
    direction,
    listingTitle,
    otherUser: {
      name:
        direction === "sent"
          ? `Receiver ${connection.receiver_id?.slice(0, 8) || ""}`
          : `Sender ${connection.initiator_id?.slice(0, 8) || ""}`,
    },
  };
}

export const connectionsApi = {
  async list() {
    const [sentResponse, receivedResponse] = await Promise.all([
      api.get("/connections/sent"),
      api.get("/connections/received"),
    ]);

    return {
      connections: [
        ...sentResponse.data.map((connection) => normalizeConnection(connection, "sent")),
        ...receivedResponse.data.map((connection) =>
          normalizeConnection(connection, "received")
        ),
      ],
    };
  },

  async accept(connectionId) {
    const { data } = await api.patch(`/connections/${connectionId}/accept`);
    return { connection: normalizeConnection(data, "received") };
  },

  async reject(connectionId) {
    const { data } = await api.patch(`/connections/${connectionId}/reject`);
    return { connection: normalizeConnection(data, "received") };
  },

  async cancel(connectionId) {
    const { data } = await api.patch(`/connections/${connectionId}/cancel`);
    return { connection: normalizeConnection(data, "sent") };
  },
};
