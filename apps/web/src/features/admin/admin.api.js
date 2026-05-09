export const adminApi = {
  pendingUsers: async () => ({ users: [] }),
  updateVerification: async (userId, status) => ({
    user: {
      id: userId,
      verificationStatus: status,
    },
  }),
  users: async () => ({ users: [] }),
};
