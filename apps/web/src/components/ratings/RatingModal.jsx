import { useState } from "react";
import { toast } from "sonner";
import Modal from "../common/Modal";
import Textarea from "../common/Textarea";
import RatingStars from "./RatingStars";

export default function RatingModal({ open, onClose, deal, onSubmit }) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");

  function submit() {
    const payload = {
      dealId: deal?.id,
      score,
      comment,
    };

    toast.success("Rating submitted.");
    onSubmit?.(payload);
    onClose?.();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Rate your experience"
      description="Your rating helps keep CarryGo safe and trustworthy."
      footer={
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-2xl border py-3 font-semibold">
            Cancel
          </button>
          <button onClick={submit} className="flex-1 rounded-2xl bg-blue-600 py-3 font-semibold text-white">
            Submit
          </button>
        </div>
      }
    >
      <div className="flex justify-center">
        <RatingStars value={score} onChange={setScore} size="lg" />
      </div>

      <div className="mt-5">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share a short comment..."
        />
      </div>
    </Modal>
  );
}
