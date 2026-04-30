import { useState } from "react";
import type { OcrReceiptResult } from "@/shared/api";

export type OcrReceiptData = OcrReceiptResult & {
  r2Key: string;
};

export function useReviewStep1() {
  const [ocrData, setOcrData] = useState<OcrReceiptData | null>(null);

  return {
    ocrData,
    setOcrData,
  };
}
