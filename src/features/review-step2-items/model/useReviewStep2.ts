import { useEffect, useState } from "react";
import type { OcrItem } from "@/features/review-step1-receipt";

export type EditableItem = {
  name: string;
  price: number;
  quantity: number;
  productCode?: string;
};

export function useReviewStep2(ocrItems: OcrItem[]) {
  const [items, setItems] = useState<EditableItem[]>([]);

  useEffect(() => {
    setItems(ocrItems.map((item) => ({ ...item })));
  }, [ocrItems]);

  const updateItem = (idx: number, name: string, price: number, productCode?: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, name, price, productCode } : item))
    );
  };

  return { items, updateItem };
}
