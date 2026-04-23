import { useState } from "react";

export type OcrItem = {
  name: string;
  price: number;
  quantity: number;
};

export type OcrReceiptData = {
  branch: string;
  totalAmount: number;
  itemCount: number;
  purchasedAt: string;
  items: OcrItem[];
};

export function useReviewStep1() {
  const [ocrData, setOcrData] = useState<OcrReceiptData | null>(null);

  return {
    ocrData,
    setOcrData,
  };
}
