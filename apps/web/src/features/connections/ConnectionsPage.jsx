import { Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import ConnectionCard from "../../components/connections/ConnectionCard";
import { connectionsApi } from "./connections.api";

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    connectionsApi
      .list()
      .then(({ connections }) => {
        if (mounted) setConnections(connections);
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

  async function updateConnection(connection, status) {
    const action =
      status === "accepted"
        ? connectionsApi.accept
        : status === "rejected"
          ? connectionsApi.reject
          : connectionsApi.cancel;

    const { connection: updatedConnection } = await action(connection.id);

    setConnections((current) =>
      current.map((item) =>
        item.id === updatedConnection.id
          ? { ...item, ...updatedConnection, listingTitle: item.listingTitle }
          : item
      )
    );
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Connections"
        title="Connection inbox"
        description="Review pending, accepted, and rejected connection requests."
      />

      {loading && <p className="text-sm text-slate-500">Loading connections...</p>}

      {error && (
        <ErrorState description="Could not load connections. Make sure you are logged in with a backend account." />
      )}

      {!loading && !error && connections.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No connections yet"
          description="Connection requests and offers will appear here."
        />
      )}

      {!loading && !error && connections.length > 0 && (
        <div className="space-y-4">
          {connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onUpdate={updateConnection}
            />
          ))}
        </div>
      )}
    </main>
  );
}
