import { Link, Outlet } from "react-router-dom";
import { PackageCheck } from "lucide-react";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-slate-950"
          >
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-600 text-white">
              <PackageCheck className="h-5 w-5" />
            </span>
            CarryGo
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="/#how-it-works" className="hover:text-slate-950">
              How it works
            </a>
            <a href="/#safety" className="hover:text-slate-950">
              Safety
            </a>
            <Link to="/trips" className="hover:text-slate-950">
              Browse trips
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
