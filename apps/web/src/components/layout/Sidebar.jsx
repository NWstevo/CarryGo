import { Link, NavLink } from "react-router-dom";
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
import Avatar from "../common/Avatar";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/trips", label: "Trips", icon: Plane },
  { to: "/requests", label: "Requests", icon: PackageSearch },
  { to: "/connections", label: "Connections", icon: Handshake },
  { to: "/chats", label: "Chats", icon: MessageCircle },
  { to: "/deals", label: "Deals", icon: PackageCheck },
  { to: "/ratings", label: "Ratings", icon: Star },
];

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-4 lg:block">
      <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3 font-bold text-slate-950">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white">
          <PackageCheck className="h-5 w-5" />
        </span>
        CarryGo
      </Link>

      <div className="mt-6 rounded-3xl bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || "Guest"} />
          <div>
            <p className="text-sm font-semibold text-slate-950">{user?.name || "Guest"}</p>
            <p className="text-xs text-slate-500">{user?.role || "member"}</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {items.map((item) => {
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
        onClick={onLogout}
        className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
      >
        <LogOut className="h-5 w-5" />
        Log out
      </button>
    </aside>
  );
}
