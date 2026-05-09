export function required(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function isPositiveNumber(value) {
  return Number(value) > 0;
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
}

export function validateTrip(payload) {
  const errors = {};

  if (!required(payload.origin)) errors.origin = "Origin is required";
  if (!required(payload.destination)) errors.destination = "Destination is required";
  if (!required(payload.departureDate)) errors.departureDate = "Departure date is required";
  if (!isPositiveNumber(payload.availableWeight)) {
    errors.availableWeight = "Available weight must be greater than zero";
  }

  return errors;
}

export function validateRequest(payload) {
  const errors = {};

  if (!required(payload.targetDestination)) {
    errors.targetDestination = "Destination is required";
  }

  if (!required(payload.targetDate)) {
    errors.targetDate = "Target date is required";
  }

  if (!required(payload.item)) {
    errors.item = "Item is required";
  }

  if (!isPositiveNumber(payload.itemWeight)) {
    errors.itemWeight = "Item weight must be greater than zero";
  }

  if (!isPositiveNumber(payload.budget)) {
    errors.budget = "Budget must be greater than zero";
  }

  return errors;
}
