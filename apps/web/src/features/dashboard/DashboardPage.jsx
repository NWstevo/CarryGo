import {
  Handshake,
  MessageCircle,
  PackageCheck,
  Plane,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../../components/common/PageHeader";
import MetricCard from "../../components/common/MetricCard";
import StatusChip from "../../components/common/StatusChip";
import { useAuthStore } from "../auth/auth.store";
import { usersApi } from "../auth/users.api";
import { connectionsApi } from "../connections/connections.api";
import { dealsApi } from "../deals/deals.api";
import { requestsApi } from "../requests/requests.api";
import { tripsApi } from "../trips/trips.api";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setSession = useAuthStore((state) => state.setSession);
  const [verifying, setVerifying] = useState(false);

  async function handleVerify() {
    try {
      setVerifying(true);
      const { verificationStatus } = await usersApi.verify();
      setSession({ user: { ...user, verificationStatus }, token });
      toast.success("Identity verified.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not verify identity.");
    } finally {
      setVerifying(false);
    }
  }
  const [summary, setSummary] = useState({
    trips: [],
    requests: [],
    connections: [],
    deals: [],
  });

  const isVerified = user?.verificationStatus === "verified";

  useEffect(() => {
    let mounted = true;

    async function loadSummary() {
      const [tripResult, requestResult] = await Promise.all([
        tripsApi.list(),
        requestsApi.list(),
      ]);

      const authenticatedResults = token
        ? await Promise.all([connectionsApi.list(), dealsApi.list()])
        : [{ connections: [] }, { deals: [] }];

      if (!mounted) return;

      setSummary({
        trips: tripResult.trips,
        requests: requestResult.requests,
        connections: authenticatedResults[0].connections,
        deals: authenticatedResults[1].deals,
      });
    }

    loadSummary().catch(() => {
      if (mounted) {
        setSummary({ trips: [], requests: [], connections: [], deals: [] });
      }
    });

    return () => {
      mounted = false;
    };
  }, [token]);

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

            <div className="flex-1">
              <h2 className="font-semibold text-amber-950">
                Your account is pending verification
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                You can browse listings, but you cannot create trips, requests,
                or start connections until CarryGo verifies your account.
              </p>

              <button
                onClick={handleVerify}
                disabled={verifying}
                className="mt-4 rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {verifying ? "Verifying..." : "Verify now"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Available trips" value={summary.trips.length} helper="Verified travelers" icon={Plane} />
        <MetricCard label="Open requests" value={summary.requests.length} helper="Sender requests" icon={PackageCheck} />
        <MetricCard label="Connections" value={summary.connections.length} helper="Pending and accepted" icon={Handshake} />
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
            {summary.deals.slice(0, 4).map((deal) => (
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

            {summary.deals.length === 0 && (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                No active deals yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Connection inbox</h2>
            <MessageCircle className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-5 space-y-3">
            {summary.connections.slice(0, 4).map((connection) => (
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

            {summary.connections.length === 0 && (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                No connection activity yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
