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
  productId?: string;
  limit?: number;
  cursor?: string;
};

export function getReviews({ productId, limit, cursor }: ReviewListParams = {}): Promise<ReviewListResponse> {
  const searchParams: Record<string, string | number> = {};
  if (productId) searchParams.productId = productId;
  if (limit !== undefined) searchParams.limit = limit;
  if (cursor !== undefined) searchParams.cursor = cursor;
  return api.get('reviews', Object.keys(searchParams).length ? { searchParams } : undefined).json<ReviewListResponse>();
}

export function getReviewDetail(id: string): Promise<ReviewDetail> {
  return api.get(`reviews/${id}`).json<ReviewDetail>();
}

export type ReviewComment = {
  id: string;
  content: string;
  createdAt: string;
  authorNickname: string;
  authorProfileImage: string | null;
  isMine: boolean;
};

export type ReviewCommentListResponse = {
  items: ReviewComment[];
  limit: number;
  hasNext: boolean;
  nextCursor: string | null;
};

export function getReviewComments(
  reviewId: string,
  params?: { limit?: number; cursor?: string },
): Promise<ReviewCommentListResponse> {
  const searchParams: Record<string, string | number> = {};
  if (params?.limit !== undefined) searchParams.limit = params.limit;
  if (params?.cursor !== undefined) searchParams.cursor = params.cursor;
  return api.get(`reviews/${reviewId}/comments`, Object.keys(searchParams).length ? { searchParams } : undefined).json<ReviewCommentListResponse>();
}

export function createReviewComment(reviewId: string, content: string): Promise<ReviewComment> {
  return api.post(`reviews/${reviewId}/comments`, { json: { content } }).json<ReviewComment>();
}

export function deleteReviewComment(reviewId: string, commentId: string): Promise<{ id: string }> {
  return api.delete(`reviews/${reviewId}/comments/${commentId}`).json<{ id: string }>();
}
