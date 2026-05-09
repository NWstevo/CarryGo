import { VERIFICATION_STATUS } from "./constants";

export function isVerified(user) {
  return user?.verificationStatus === VERIFICATION_STATUS.VERIFIED;
}

export function isAdmin(user) {
  return user?.role === "admin";
}

export function canCreateListings(user) {
  return isVerified(user) && user?.role !== "admin";
}

export function canOpenChat(connection) {
  return connection?.status === "accepted";
}

export function canUploadForStage({ role, stage }) {
  if (stage === "pre_handover") {
    return role === "sender";
  }

  if (stage === "handover") {
    return role === "sender" || role === "traveler";
  }

  if (stage === "delivery") {
    return role === "traveler";
  }

  if (stage === "dispute_evidence") {
    return role === "sender" || role === "traveler";
  }

  return false;
}

export function getDealActions({ deal, role }) {
  if (!deal) return [];

  if (deal.status === "agreed" && role === "traveler") {
    return ["mark_in_transit"];
  }

  if (deal.status === "in_transit" && role === "traveler") {
    return ["mark_delivered"];
  }

  if (deal.status === "delivered" && role === "sender") {
    return ["confirm_completed"];
  }

  if (["pending", "agreed", "in_transit"].includes(deal.status)) {
    return ["raise_dispute"];
  }

  return [];
}
