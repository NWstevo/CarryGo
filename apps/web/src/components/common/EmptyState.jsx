export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      {Icon && (
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
          <Icon className="h-7 w-7 text-slate-500" />
        </div>
      )}

      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
