import { useAuthStore } from "../features/auth/auth.store";

export default function useAuth() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    logout,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isVerified: user?.verificationStatus === "verified",
  };
}
