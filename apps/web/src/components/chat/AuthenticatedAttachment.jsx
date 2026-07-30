import { useEffect, useState } from "react";
import { api } from "../../lib/axios";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");

export default function AuthenticatedAttachment({ path, kind }) {
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!path) return;

    let objectUrl;
    let cancelled = false;

    api
      .get(path, { baseURL: API_ORIGIN, responseType: "blob" })
      .then((response) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(response.data);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  if (failed) {
    return <p className="mb-2 text-xs text-red-600">Could not load attachment.</p>;
  }

  if (!src) {
    return <div className="mb-2 h-40 w-52 animate-pulse rounded-2xl bg-slate-200" />;
  }

  if (kind === "video") {
    return <video controls src={src} className="mb-2 max-h-64 rounded-2xl" />;
  }

  return (
    <img src={src} alt="Attachment" className="mb-2 max-h-64 rounded-2xl object-cover" />
  );
}
