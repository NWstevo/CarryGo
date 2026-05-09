export const APP_NAME = "CarryGo";

export const VERIFICATION_STATUS = {
  PENDING: "pending_verification",
  VERIFIED: "verified",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
};

export const CONNECTION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CLOSED: "closed",
};

export const DEAL_STATUS = {
  PENDING: "pending",
  AGREED: "agreed",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DISPUTED: "disputed",
};

export const VERIFICATION_STAGES = [
  "pre_handover",
  "handover",
  "delivery",
  "dispute_evidence",
];
