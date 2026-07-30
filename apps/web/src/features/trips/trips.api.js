import { api } from "../../lib/axios";

function normalizeTrip(trip = {}) {
  return {
    ...trip,
    departureDate: trip.departure_date || trip.departureDate,
    availableWeight: trip.available_weight ?? trip.availableWeight,
    traveler: {
      id: trip.traveler_id,
      name: trip.traveler_name || "Traveler",
      ratingAverage: trip.rating_average ?? null,
      verified: true,
    },
  };
}

export const tripsApi = {
  async list() {
    const { data } = await api.get("/trips");
    return { trips: data.map(normalizeTrip) };
  },

  async detail(tripId) {
    const { trips } = await tripsApi.list();
    return { trip: trips.find((trip) => trip.id === tripId) || null, tripId };
  },

  async create(payload) {
    const { data } = await api.post("/trips", {
      origin: payload.origin,
      destination: payload.destination,
      departure_date: payload.departure_date || payload.departureDate,
      available_weight: payload.available_weight || payload.availableWeight,
    });

    return { trip: normalizeTrip(data) };
  },

  async requestConnection(tripId, payload = {}) {
    const { data } = await api.post(`/connections/trips/${tripId}`, {
      message: payload.message,
      item_category: payload.item_category,
      declared_value: payload.declared_value,
      item_origin_country: payload.item_origin_country,
    });

    return { connection: data };
  },
};
