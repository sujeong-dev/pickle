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
  const [lastLen, setLastLen] = useState(ocrItems.length);
  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(
    () => new Set(ocrItems.map((_, i) => i)),
  );

  if (lastLen !== ocrItems.length) {
    setLastLen(ocrItems.length);
    setSelectedIdxs(new Set(ocrItems.map((_, i) => i)));
    setOverrides({});
  }

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

  const toggleSelect = (idx: number) => {
    setSelectedIdxs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return { items, updateItem, selectedIdxs, toggleSelect };
}
