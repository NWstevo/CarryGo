import { Handshake } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import DealCard from "../../components/deals/DealCard";
import { useAuthStore } from "../auth/auth.store";
import { dealsApi } from "./deals.api";

export default function DealsPage() {
  const user = useAuthStore((state) => state.user);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    dealsApi
      .list()
      .then(({ deals }) => {
        if (mounted) setDeals(deals);
      })
      .catch((error) => {
        if (mounted) setError(error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function updateDeal(deal, status) {
    const { deal: updatedDeal } = await dealsApi.updateStatus(deal.id, status);

    setDeals((current) =>
      current.map((item) =>
        item.id === updatedDeal.id ? { ...item, ...updatedDeal } : item
      )
    );
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Deals"
        title="Deal tracking"
        description="Track delivery status from agreement to completion."
      />

      {loading && <p className="text-sm text-slate-500">Loading deals...</p>}

      {error && (
        <ErrorState description="Could not load deals. Make sure you are logged in with a backend account." />
      )}

      {!loading && !error && deals.length === 0 && (
        <EmptyState
          icon={Handshake}
          title="No deals yet"
          description="Accepted connections can become tracked deals."
        />
      )}

      {!loading && !error && deals.length > 0 && (
        <div className="space-y-4">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              role={deal.travelerId === user?.id ? "traveler" : "sender"}
              onUpdate={updateDeal}
            />
          ))}
        </div>
      )}
    </main>
  );
}
