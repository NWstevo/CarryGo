import VerificationStageBadge from "./VerificationStageBadge";

export default function MessageBubble({ message, currentUserId }) {
  const mine = message.senderId === currentUserId;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[78%] rounded-3xl px-4 py-3 text-sm shadow-sm",
          mine
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-900",
        ].join(" ")}
      >
        {message.stage && (
          <div className="mb-2">
            <VerificationStageBadge stage={message.stage} />
          </div>
        )}

        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Attachment"
            className="mb-2 max-h-64 rounded-2xl object-cover"
          />
        )}

        {message.text && <p>{message.text}</p>}

        {message.createdAt && (
          <p className={["mt-2 text-[11px]", mine ? "text-blue-100" : "text-slate-400"].join(" ")}>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
