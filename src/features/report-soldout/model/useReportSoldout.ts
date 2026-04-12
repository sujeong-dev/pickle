import { useState } from "react";

export function useReportSoldout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);

  return {
    isOpen,
    isReported,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    report: () => {
      setIsReported(true);
      setIsOpen(false);
    },
  };
}
