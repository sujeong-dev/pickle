import { useState } from "react";
import type { ReceiptItem } from "@/shared/api/receipt";

export type ReceiptData = {
  receiptId: string;
  items: ReceiptItem[];
  totalAmount: number;
};

export function useReviewStep1() {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  return {
    receiptData,
    setReceiptData,
  };
}
