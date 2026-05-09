const variants = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-700",
  dark: "bg-slate-950 text-white",
};

export default function Badge({ children, variant = "slate", className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant] || variants.slate,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
