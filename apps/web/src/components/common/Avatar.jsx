export default function Avatar({ name = "User", src, size = "md", className = "" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={[
          "rounded-full object-cover ring-1 ring-slate-200",
          sizes[size],
          className,
        ].join(" ")}
      />
    );
  }

  return (
    <div
      className={[
        "grid shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700 ring-1 ring-blue-200",
        sizes[size],
        className,
      ].join(" ")}
    >
      {initials || "U"}
    </div>
  );
}
