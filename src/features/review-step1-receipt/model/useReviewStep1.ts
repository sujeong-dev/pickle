import { useState } from "react";

export function useReviewStep1() {
  const [receipt, setReceipt] = useState<File | null>(null);
  return { receipt, setReceipt };
}
