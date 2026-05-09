import Avatar from "../common/Avatar";

export default function ChatList({ chats = [], activeId, onSelect }) {
  return (
    <aside className="border-r border-slate-200">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelect?.(chat)}
          className={[
            "flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left hover:bg-slate-50",
            activeId === chat.id && "bg-blue-50",
          ].join(" ")}
        >
          <Avatar name={chat.otherUser?.name || "User"} />
          <div>
            <p className="font-medium text-slate-950">{chat.otherUser?.name}</p>
            <p className="text-sm text-slate-500">{chat.status || "Accepted connection"}</p>
          </div>
        </button>
      ))}
    </aside>
  );
}
