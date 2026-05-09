import { Link, useNavigate } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { useAuthStore } from "./auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginAsUser = useAuthStore((state) => state.loginAsUser);
  const loginAsAdmin = useAuthStore((state) => state.loginAsAdmin);

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

        <div className="mt-6 space-y-4">
          <div>
            <label className="app-label">Email</label>
            <input className="app-input mt-1" placeholder="you@example.com" />
          </div>

          <div>
            <label className="app-label">Password</label>
            <input
              className="app-input mt-1"
              placeholder="••••••••"
              type="password"
            />
          </div>

          <button
            onClick={handleUserLogin}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Log in as user
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
