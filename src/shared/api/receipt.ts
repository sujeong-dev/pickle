import { api } from './kyInstance';
import type { Review } from '@/entities/review';

// ── Types ────────────────────────────────────────────────────

export type ReceiptItem = {
  name: string;
  price: number;
  quantity: number;
  discountedPrice?: number;
};

export type RegisterReceiptBody = {
  imageUrl: string;
};

export type RegisterReceiptResponse = {
  id: string;
  items: ReceiptItem[];
  totalAmount: number;
};

export type CreateReviewBody = {
  postId: string;
  rating: number;
  content: string;
  receiptId?: string;
  imageUrls?: string[];
};

export type UpdateReviewBody = {
  rating?: number;
  content?: string;
};

// ── API Functions ─────────────────────────────────────────────

export function registerReceipt(body: RegisterReceiptBody): Promise<RegisterReceiptResponse> {
  return api.post('api/receipts', { json: body }).json<RegisterReceiptResponse>();
}

export function createReview(body: CreateReviewBody): Promise<Review> {
  return api.post('api/reviews', { json: body }).json<Review>();
}

export function updateReview(id: string, body: UpdateReviewBody): Promise<Review> {
  return api.patch(`api/reviews/${id}`, { json: body }).json<Review>();
}

export function deleteReview(id: string): Promise<void> {
  return api.delete(`api/reviews/${id}`).json<void>();
}
