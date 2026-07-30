import { useState } from "react";
import { Send } from "lucide-react";
import Badge from "../common/Badge";
import MessageBubble from "./MessageBubble";
import UploadPanel from "./UploadPanel";

const stages = ["pre_handover", "handover", "delivery", "dispute_evidence"];

export default function ChatWindow({
  connection,
  messages = [],
  currentUserId,
  role = "sender",
  onSend,
}) {
  const [text, setText] = useState("");
  const [stage, setStage] = useState("handover");
  const [file, setFile] = useState(null);

  function submit() {
    if (!text.trim() && !file) return;

    onSend?.({
      id: crypto.randomUUID(),
      senderId: currentUserId,
      text,
      stage,
      file,
      createdAt: new Date().toISOString(),
    });

    setText("");
    setFile(null);
  }

  return (
    <section className="flex min-h-[600px] flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white p-4">
        <h2 className="flex items-center gap-2 font-semibold text-slate-950">
          {connection?.otherUser?.name || "Conversation"}
          {connection?.otherUser?.roleLabel && (
            <Badge variant="blue">{connection.otherUser.roleLabel}</Badge>
          )}
        </h2>
        <p className="text-sm text-green-700">Chat unlocked · You are {role}</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
        ))}
      </div>

      <footer className="border-t border-slate-200 bg-white p-4">
        <div className="mb-3 flex gap-2 overflow-x-auto">
          {stages.map((item) => (
            <button
              key={item}
              onClick={() => setStage(item)}
              className={[
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold",
                stage === item ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              {item.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2">
          <UploadPanel role={role} stage={stage} file={file} onFileChange={setFile} />

          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            className="app-input max-h-32 flex-1 resize-none"
          />

          <button
            onClick={submit}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </section>
  );
}
