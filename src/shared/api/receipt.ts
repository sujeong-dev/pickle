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
  store: string;
  branch: string;
  totalAmount: number;
  itemCount: number;
  purchasedAt: string;
};

export type RegisterReceiptResponse = {
  id: string;
  items: ReceiptItem[];
  totalAmount: number;
};

export type CreateReviewBody = {
  receiptId: string;
  productName: string;
  rating: number;
  imageKeys?: string[];
};

export type UpdateReviewBody = {
  rating?: number;
  content?: string;
};

// ── API Functions ─────────────────────────────────────────────

export function registerReceipt(body: RegisterReceiptBody): Promise<RegisterReceiptResponse> {
  return api.post('receipts', { json: body }).json<RegisterReceiptResponse>();
}

export function createReview(body: CreateReviewBody): Promise<Review> {
  return api.post('reviews', { json: body }).json<Review>();
}

export function updateReview(id: string, body: UpdateReviewBody): Promise<Review> {
  return api.patch(`reviews/${id}`, { json: body }).json<Review>();
}

export function deleteReview(id: string): Promise<void> {
  return api.delete(`reviews/${id}`).json<void>();
}
