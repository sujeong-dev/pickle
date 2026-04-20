import { api } from './kyInstance';
import type { Review } from '@/entities/review';

export type ReviewDetail = Review & {
  receiptItems: { name: string; price: number; quantity: number }[];
  receiptImageUrl?: string;
};

export type ReviewListResponse = {
  items: Review[];
  limit: number;
  hasNext: boolean;
  nextCursor: string | null;
};

export type ReviewListParams = {
  productId: string;
  limit?: number;
  cursor?: string;
};

export function getReviews({ productId, limit, cursor }: ReviewListParams): Promise<ReviewListResponse> {
  const searchParams: Record<string, string | number> = { productId };
  if (limit !== undefined) searchParams.limit = limit;
  if (cursor !== undefined) searchParams.cursor = cursor;
  return api.get('reviews', { searchParams }).json<ReviewListResponse>();
}

export function getReviewDetail(id: string): Promise<ReviewDetail> {
  return api.get(`reviews/${id}`).json<ReviewDetail>();
}
