import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  PackageSearch,
  MessageCircle,
  Handshake,
  Star,
  LogOut,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "../../features/auth/auth.store";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/trips", label: "Trips", icon: Plane },
  { to: "/requests", label: "Requests", icon: PackageSearch },
  { to: "/connections", label: "Connections", icon: Handshake },
  { to: "/chats", label: "Chats", icon: MessageCircle },
  { to: "/deals", label: "Deals", icon: PackageCheck },
  { to: "/ratings", label: "Ratings", icon: Star },
];

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-4 lg:block">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-2 py-3 font-bold text-slate-950"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white">
            <PackageCheck className="h-5 w-5" />
          </span>
          CarryGo
        </Link>

        <div className="mt-6 rounded-3xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">
              {user?.name?.charAt(0) || "G"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {user?.name || "Guest"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role === "admin" ? "Admin" : "Member"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-green-700">
            <ShieldCheck className="h-4 w-4" />
            {user?.verificationStatus?.replace("_", " ") || "not signed in"}
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
              }
            >
              <ShieldCheck className="h-5 w-5" />
              Admin
            </NavLink>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </aside>

      <main className="pb-20 lg:ml-72 lg:pb-0">
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-600 text-white">
                <PackageCheck className="h-5 w-5" />
              </span>
              CarryGo
            </Link>

            <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {user?.name?.charAt(0) || "G"}
            </div>
          </div>
        </div>

        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium",
                  isActive ? "text-blue-600" : "text-slate-500",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
