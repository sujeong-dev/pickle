import { useMemo, useState } from "react";

export type EditableItem = {
  name: string;
  price: number;
  quantity: number;
  productCode?: string;
};

type Override = { name?: string; price?: number; productCode?: string };

export function useReviewStep2(ocrItems: EditableItem[]) {
  const [overrides, setOverrides] = useState<Record<number, Override>>({});

  const items = useMemo<EditableItem[]>(
    () =>
      ocrItems.map((it, i) => ({
        ...it,
        ...overrides[i],
      })),
    [ocrItems, overrides],
  );

  const updateItem = (idx: number, name: string, price: number, productCode?: string) => {
    setOverrides((prev) => ({ ...prev, [idx]: { name, price, productCode } }));
  };

  return { items, updateItem };
}
