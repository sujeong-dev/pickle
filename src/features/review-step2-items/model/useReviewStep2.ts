import { useState } from "react";

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

export function useReviewStep2() {
  const [items] = useState<ReviewItem[]>(MOCK_ITEMS);
  return { items };
}
