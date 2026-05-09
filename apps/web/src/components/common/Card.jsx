export default function Card({ children, className = "", as: Component = "div" }) {
  return (
    <Component
      className={[
        "rounded-3xl border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={["p-5 pb-0", className].join(" ")}>{children}</div>;
}

export function CardBody({ children, className = "" }) {
  return <div className={["p-5", className].join(" ")}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={["border-t border-slate-100 p-5", className].join(" ")}>
      {children}
    </div>
  );
}
