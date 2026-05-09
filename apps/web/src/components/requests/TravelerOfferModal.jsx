import { useState } from "react";
import { toast } from "sonner";
import Modal from "../common/Modal";
import Textarea from "../common/Textarea";

export default function TravelerOfferModal({ request, open, onClose }) {
  const [message, setMessage] = useState("");

  function submit() {
    toast.success("Traveler offer sent.");
    setMessage("");
    onClose?.();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Offer to carry"
      description={`Send an offer for ${request?.item || "this package"}.`}
      footer={
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-2xl border py-3 font-semibold">
            Cancel
          </button>
          <button onClick={submit} className="flex-1 rounded-2xl bg-blue-600 py-3 font-semibold text-white">
            Send offer
          </button>
        </div>
      }
    >
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Example: I am flying there on May 20 and can carry this safely."
      />
    </Modal>
  );
}
