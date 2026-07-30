import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "./auth.api";
import { useAuthStore } from "./auth.store";

export default function GoogleAuthButton({ termsAccepted = true }) {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  async function handleSuccess(credentialResponse) {
    try {
      const session = await authApi.google(credentialResponse.credential, termsAccepted);
      setSession(session);
      toast.success("Signed in with Google.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed.");
    }
  }

  if (!termsAccepted) {
    return (
      <div
        title="Accept the Terms of Service and Privacy Policy first"
        className="flex h-10 w-full cursor-not-allowed items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-400"
      >
        Continue with Google
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed.")}
      />
    </div>
  );
}
