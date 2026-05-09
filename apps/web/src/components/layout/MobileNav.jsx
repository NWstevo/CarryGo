import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  PackageSearch,
  MessageCircle,
  Handshake,
} from "lucide-react";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/trips", label: "Trips", icon: Plane },
  { to: "/requests", label: "Requests", icon: PackageSearch },
  { to: "/connections", label: "Connect", icon: Handshake },
  { to: "/chats", label: "Chats", icon: MessageCircle },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden">
      {items.map((item) => {
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
  );
}
