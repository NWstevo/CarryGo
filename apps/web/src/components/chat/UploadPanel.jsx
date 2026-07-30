import { ImagePlus, Video } from "lucide-react";
import { canUploadForStage } from "../../lib/permissions";

export default function UploadPanel({ role, stage, file, onFileChange }) {
  const allowed = canUploadForStage({ role, stage });
  const isVideo = file?.type?.startsWith("video/");
  const Icon = isVideo ? Video : ImagePlus;

  return (
    <div>
      {file && (
        <div className="mb-2 rounded-2xl bg-slate-100 p-3 text-sm text-slate-600">
          Attached: {file.name}
        </div>
      )}

      <label
        className={[
          "grid h-11 w-11 cursor-pointer place-items-center rounded-2xl border border-slate-200",
          !allowed && "cursor-not-allowed opacity-40",
        ].join(" ")}
      >
        <Icon className="h-5 w-5 text-slate-600" />
        <input
          type="file"
          accept="image/*,video/*"
          disabled={!allowed}
          className="hidden"
          onChange={(e) => onFileChange?.(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}
