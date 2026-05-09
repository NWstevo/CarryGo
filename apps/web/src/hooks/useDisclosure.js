import { useCallback, useState } from "react";

export default function useDisclosure(initialValue = false) {
  const [open, setOpen] = useState(initialValue);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((current) => !current), []);

  return {
    open,
    setOpen,
    onOpen,
    onClose,
    onToggle,
  };
}
