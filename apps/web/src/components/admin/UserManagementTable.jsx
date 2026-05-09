import StatusChip from "../common/StatusChip";

export default function UserManagementTable({ users = [], onSelect }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden grid-cols-4 gap-4 border-b border-slate-100 bg-slate-50 p-4 text-sm font-semibold text-slate-600 md:grid">
        <div>Name</div>
        <div>Email</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-4 md:items-center"
        >
          <div className="font-semibold text-slate-950">{user.name}</div>
          <div className="text-sm text-slate-500">{user.email}</div>
          <div>
            <StatusChip status={user.verificationStatus || user.status} />
          </div>
          <div>
            <button
              onClick={() => onSelect?.(user)}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
            >
              Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
