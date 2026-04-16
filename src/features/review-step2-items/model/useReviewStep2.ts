import { useMemo } from "react";
import type { ReceiptItem } from "@/shared/api/receipt";

export type ReviewItem = {
  name: string;
  price: string;
};

const MOCK_ITEMS: ReviewItem[] = [
  { name: "커클랜드 물티슈", price: "12,900원" },
  { name: "커클랜드 물티슈", price: "12,900원" },
  { name: "커클랜드 물티슈", price: "12,900원" },
  { name: "커클랜드 물티슈", price: "12,900원" },
];

function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

export function useReviewStep2(receiptItems?: ReceiptItem[]) {
  const items = useMemo<ReviewItem[]>(() => {
    if (!receiptItems || receiptItems.length === 0) return MOCK_ITEMS;
    return receiptItems.map((item) => ({
      name: item.name,
      price: formatPrice(item.discountedPrice ?? item.price),
    }));
  }, [receiptItems]);

  return { items };
}
