export const dealsApi = {
  list: async () => ({ deals: [] }),
  updateStatus: async (dealId, status) => ({
    deal: { id: dealId, status },
  }),
};
