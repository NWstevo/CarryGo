export const ratingsApi = {
  list: async () => ({ ratings: [] }),
  create: async (payload) => ({
    rating: {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...payload,
    },
  }),
};
