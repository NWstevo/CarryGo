import { Link } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import Avatar from "../common/Avatar";

export default function Navbar({ user }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-600 text-white">
            <PackageCheck className="h-5 w-5" />
          </span>
          CarryGo
        </Link>

        <Avatar name={user?.name || "Guest"} size="sm" />
      </div>
    </header>
  );
}
