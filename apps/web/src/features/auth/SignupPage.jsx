import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Start sending or carrying packages safely.
        </p>

        <div className="mt-6 space-y-4">
          <input className="app-input" placeholder="Full name" />
          <input className="app-input" placeholder="Email address" />
          <input className="app-input" placeholder="Password" type="password" />

          <Link
            to="/dashboard"
            className="block rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create account
          </Link>
        </div>

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
