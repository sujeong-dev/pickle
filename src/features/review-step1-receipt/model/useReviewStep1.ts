import { useState } from "react";
import type { ReceiptItem } from "@/shared/api/receipt";

export type ReceiptData = {
  receiptId: string;
  imageUrl: string;
  items: ReceiptItem[];
  totalAmount: number;
};

export function useReviewStep1() {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const removeReceipt = () => {
    setReceipt(null);
    setReceiptData(null);
  };

  return {
    receipt,
    setReceipt,
    receiptData,
    setReceiptData,
    removeReceipt,
  };
}
