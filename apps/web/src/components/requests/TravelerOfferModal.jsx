import { useEffect, useState } from "react";
import { toast } from "sonner";
import Modal from "../common/Modal";
import Textarea from "../common/Textarea";
import Input from "../common/Input";
import Select from "../common/Select";
import { itemCategoriesApi } from "../../lib/itemCategories.api";

export default function TravelerOfferModal({ request, open, onClose, onSubmit }) {
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [itemCategory, setItemCategory] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [itemOriginCountry, setItemOriginCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    itemCategoriesApi
      .list()
      .then(({ categories }) => setCategories(categories))
      .catch(() => setCategories([]));
  }, []);

  async function submit() {
    if (!itemCategory || !declaredValue || !itemOriginCountry) {
      toast.error("Item category, declared value, and origin country are required.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit?.({
        message,
        item_category: itemCategory,
        declared_value: declaredValue,
        item_origin_country: itemOriginCountry,
      });
      toast.success("Traveler offer sent.");
      setMessage("");
      setItemCategory("");
      setDeclaredValue("");
      setItemOriginCountry("");
      onClose?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send offer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Offer to carry"
      description={`Declare the item you'd carry for ${request?.item || "this package"}.`}
      footer={
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-2xl border py-3 font-semibold">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="flex-1 rounded-2xl bg-blue-600 py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send offer"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Select
          label="Item category"
          name="item_category"
          value={itemCategory}
          onChange={(e) => setItemCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </Select>

        <Input
          label="Declared value (USD)"
          name="declared_value"
          type="number"
          min="1"
          step="1"
          value={declaredValue}
          onChange={(e) => setDeclaredValue(e.target.value)}
        />

        <Input
          label="Item origin country (2-letter code)"
          name="item_origin_country"
          maxLength={2}
          placeholder="e.g. US"
          value={itemOriginCountry}
          onChange={(e) => setItemOriginCountry(e.target.value.toUpperCase())}
        />

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: I am flying there on May 20 and can carry this safely."
        />
      </div>
    </Modal>
  );
}
