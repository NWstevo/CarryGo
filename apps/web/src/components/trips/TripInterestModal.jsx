import { useState } from "react";
import { toast } from "sonner";
import Modal from "../common/Modal";
import Textarea from "../common/Textarea";

export default function TripInterestModal({ trip, open, onClose }) {
  const [message, setMessage] = useState("");

  function submit() {
    toast.success("Interest request sent.");
    setMessage("");
    onClose?.();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request this traveler"
      description={`Send a short note for the trip to ${trip?.destination || "destination"}.`}
      footer={
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-2xl border py-3 font-semibold">
            Cancel
          </button>
          <button onClick={submit} className="flex-1 rounded-2xl bg-blue-600 py-3 font-semibold text-white">
            Send request
          </button>
        </div>
      }
    >
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Example: I need to send a 3kg laptop bag before Friday."
      />
    </Modal>
  );
}
