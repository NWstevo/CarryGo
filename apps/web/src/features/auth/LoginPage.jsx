import { Link, useNavigate } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { authApi } from "./auth.api";
import { useAuthStore } from "./auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const loginAsUser = useAuthStore((state) => state.loginAsUser);
  const loginAsAdmin = useAuthStore((state) => state.loginAsAdmin);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      const session = await authApi.login(form);
      setSession(session);
      toast.success("Logged in.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleUserLogin() {
    loginAsUser();
    navigate("/dashboard");
  }

  function handleAdminLogin() {
    loginAsAdmin();
    navigate("/admin");
  }

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white">
          <PackageCheck className="h-6 w-6" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-950">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Log in to manage trips, requests, chats, and deals.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={updateField}
            required
          />

          <Input
            label="Password"
            name="password"
            placeholder="••••••••"
            type="password"
            value={form.password}
            onChange={updateField}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <div className="mt-4 grid gap-3">
          <button
            onClick={handleUserLogin}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Demo user login
          </button>

          <button
            onClick={handleAdminLogin}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Demo admin login
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          No account?{" "}
          <Link to="/signup" className="font-semibold text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
