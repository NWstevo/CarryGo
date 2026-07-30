import { Handshake } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ChatList from "../../components/chat/ChatList";
import ChatWindow from "../../components/chat/ChatWindow";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import { useAuthStore } from "../auth/auth.store";
import { connectionsApi } from "../connections/connections.api";
import { dealsApi } from "../deals/deals.api";
import { chatApi } from "./chat.api";

export default function ChatPage() {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [connections, setConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [connectionsError, setConnectionsError] = useState(null);

  useEffect(() => {
    let mounted = true;

    connectionsApi
      .list()
      .then(({ connections }) => {
        if (mounted) {
          setConnections(connections.filter((item) => item.status === "accepted"));
        }
      })
      .catch((error) => {
        if (mounted) setConnectionsError(error);
      })
      .finally(() => {
        if (mounted) setLoadingConnections(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Chats"
        title="Messages"
        description="Private chat opens after a connection is accepted."
      />

      {loadingConnections && <p className="text-sm text-slate-500">Loading chats...</p>}

      {!loadingConnections && connectionsError && (
        <ErrorState description="Could not load your accepted connections." />
      )}

      {!loadingConnections && !connectionsError && connections.length === 0 && (
        <EmptyState
          icon={Handshake}
          title="No open chats yet"
          description="Accept a connection to start a private conversation."
        />
      )}

      {!loadingConnections && !connectionsError && connections.length > 0 && (
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-[280px_1fr]">
          <ChatList
            chats={connections}
            activeId={connectionId}
            onSelect={(connection) => navigate(`/chats/${connection.id}`)}
          />

          {connectionId ? (
            <ActiveConversation
              key={connectionId}
              connectionId={connectionId}
              connection={connections.find((item) => item.id === connectionId)}
              currentUserId={user?.id}
            />
          ) : (
            <div className="grid place-items-center p-10 text-sm text-slate-500">
              Select a chat to start messaging.
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function ActiveConversation({ connectionId, connection, currentUserId }) {
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    chatApi
      .createFromConnection(connectionId)
      .then(({ chat }) => {
        if (!mounted) return null;
        setChat(chat);
        return chatApi.messages(chat.id);
      })
      .then((result) => {
        if (mounted && result) setMessages(result.messages);
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
  }, [connectionId]);

  const role = connection
    ? connection.initiator_id === currentUserId
      ? connection.initiator_role
      : connection.receiver_role
    : "sender";

  async function handleSend({ text, stage, file }) {
    try {
      const { message } = await chatApi.sendMessage(chat.id, {
        content: text,
        verificationStage: stage,
        file,
      });
      setMessages((current) => [...current, message]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send message.");
    }
  }

  async function handleFinalizeDeal() {
    try {
      await dealsApi.create(connectionId);
      toast.success("Deal created. This ad is now booked.");
      navigate("/deals");
    } catch (error) {
      if (error.response?.data?.message === "A deal already exists for this connection") {
        navigate("/deals");
        return;
      }
      toast.error(error.response?.data?.message || "Could not create deal.");
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-slate-500">Loading conversation...</p>;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState description="Could not open this chat." />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-end border-b border-slate-200 bg-white px-4 py-3">
        <button
          onClick={handleFinalizeDeal}
          className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Finalize deal
        </button>
      </div>

      <ChatWindow
        connection={connection}
        messages={messages}
        currentUserId={currentUserId}
        role={role}
        onSend={handleSend}
      />
    </div>
  );
}
