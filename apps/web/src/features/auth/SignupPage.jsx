import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { authApi } from "./auth.api";
import { useAuthStore } from "./auth.store";
import GoogleAuthButton from "./GoogleAuthButton";

export default function SignupPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!termsAccepted) {
      toast.error("You must accept the Terms of Service and Privacy Policy to sign up.");
      return;
    }

    try {
      setLoading(true);
      const session = await authApi.signup({ ...form, terms_accepted: termsAccepted });
      setSession(session);
      toast.success("Account created.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Start sending or carrying packages safely.
        </p>

        <label className="mt-6 flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            required
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" target="_blank" className="font-semibold text-blue-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" target="_blank" className="font-semibold text-blue-600">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <div className="mt-4">
          <GoogleAuthButton termsAccepted={termsAccepted} />
        </div>

        <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          or
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="full_name"
            placeholder="Full name"
            value={form.full_name}
            onChange={updateField}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={updateField}
            required
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={updateField}
            required
          />

          <Button type="submit" className="w-full" disabled={loading || !termsAccepted}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
