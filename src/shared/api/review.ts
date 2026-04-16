import { api } from './kyInstance';
import type { Review } from '@/entities/review';

export type ReviewDetail = Review & {
  receiptItems: { name: string; price: number; quantity: number }[];
  receiptImageUrl?: string;
};

export type ReviewListResponse = {
  data: Review[];
  total: number;
  page: number;
  size: number;
};

export type ReviewListParams = {
  postId: string;
  page?: number;
  size?: number;
};

export function getReviews({ postId, page, size }: ReviewListParams): Promise<ReviewListResponse> {
  const searchParams: Record<string, string | number> = { postId };
  if (page !== undefined) searchParams.page = page;
  if (size !== undefined) searchParams.size = size;
  return api.get('reviews', { searchParams }).json<ReviewListResponse>();
}

export function getReviewDetail(id: string): Promise<ReviewDetail> {
  return api.get(`reviews/${id}`).json<ReviewDetail>();
}
