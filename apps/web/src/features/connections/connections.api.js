import { api } from "../../lib/axios";

const ROLE_LABELS = {
  sender: "Sender",
  traveler: "Traveler",
};

function normalizeConnection(connection = {}, direction = "sent") {
  const listingTitle = connection.trip_id
    ? `Trip connection ${connection.trip_id.slice(0, 8)}`
    : `Request connection ${connection.request_id?.slice(0, 8) || ""}`;

  const otherRole = direction === "sent" ? connection.receiver_role : connection.initiator_role;
  const myRole = direction === "sent" ? connection.initiator_role : connection.receiver_role;

  return {
    ...connection,
    direction,
    listingTitle,
    myRole,
    otherUser: {
      name:
        (direction === "sent" ? connection.receiver_name : connection.initiator_name) ||
        "CarryGo user",
      role: otherRole,
      roleLabel: ROLE_LABELS[otherRole] || otherRole,
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
