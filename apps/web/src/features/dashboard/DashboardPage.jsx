import {
  Handshake,
  MessageCircle,
  PackageCheck,
  Plane,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import MetricCard from "../../components/common/MetricCard";
import StatusChip from "../../components/common/StatusChip";
import { useAuthStore } from "../auth/auth.store";
import { connections, deals, requests, trips } from "../../lib/mockData";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const isVerified = user?.verificationStatus === "verified";

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
        description="Manage trips, package requests, secure connections, active deals, and reputation."
      />

      {!isVerified && (
        <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <h2 className="font-semibold text-amber-950">
                Your account is pending verification
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                You can browse listings, but you cannot create trips, requests,
                or start connections until CarryGo verifies your account.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Available trips" value={trips.length} helper="Verified travelers" icon={Plane} />
        <MetricCard label="Open requests" value={requests.length} helper="Sender requests" icon={PackageCheck} />
        <MetricCard label="Connections" value={connections.length} helper="Pending and accepted" icon={Handshake} />
        <MetricCard label="Rating" value={user?.ratingAverage || "New"} helper={`${user?.ratingCount || 0} reviews`} icon={Star} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Active deals</h2>
            <Link to="/deals" className="text-sm font-semibold text-blue-600">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-950">
                    {deal.origin} → {deal.destination}
                  </p>
                  <p className="text-sm text-slate-500">
                    {deal.item} · ${deal.budget}
                  </p>
                </div>

                <StatusChip status={deal.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Connection inbox</h2>
            <MessageCircle className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-5 space-y-3">
            {connections.map((connection) => (
              <div key={connection.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-950">
                    {connection.otherUser?.name || connection.otherUser}
                  </p>
                  <StatusChip status={connection.status} />
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {connection.listingTitle}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
