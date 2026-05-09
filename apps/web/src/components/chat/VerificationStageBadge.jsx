import Badge from "../common/Badge";

const variants = {
  pre_handover: "amber",
  handover: "blue",
  delivery: "green",
  dispute_evidence: "red",
};

export default function VerificationStageBadge({ stage }) {
  if (!stage) return null;

  return (
    <Badge variant={variants[stage] || "slate"}>
      {String(stage).replace("_", " ")}
    </Badge>
  );
}
