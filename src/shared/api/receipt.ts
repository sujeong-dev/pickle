import { api } from './kyInstance';
import type { Review } from '@/entities/review';

// ── Types ────────────────────────────────────────────────────

export type ReceiptStore = 'costco' | 'traders';

export type OcrReceiptItem = {
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  finalPrice: number;
};

export type OcrReceiptResult = {
  store: ReceiptStore | null;
  branch: string;
  totalAmount: number;
  itemCount: number;
  purchasedAt: string; // YYYY-MM-DD
  items: OcrReceiptItem[];
};

export type ReceiptOcrJobStatus = 'waiting' | 'active' | 'completed' | 'failed';

export type ReceiptOcrStatusResponse = {
  jobId: string;
  status: ReceiptOcrJobStatus;
  result?: OcrReceiptResult;
  failedReason?: string;
};

export type EnqueueReceiptOcrBody = {
  r2Key: string;
};

export type EnqueueReceiptOcrResponse = {
  jobId: string;
};

export type CreateReceiptBody = {
  r2Key: string;
  store: ReceiptStore;
  branch: string;
  totalAmount: number;
  itemCount: number;
  purchasedAt: string; // YYYY-MM-DD
};

export type CreateReceiptResponse = {
  id: string;
  store: ReceiptStore;
  branch: string;
  totalAmount: number;
  itemCount: number;
  purchasedAt: string;
  isVerified: boolean;
  createdAt: string;
};

export type CreateReviewBody = {
  receiptId: string;
  rating: number;
  content: string;
  productName: string;
  imageKeys?: string[];
};

export type UpdateReviewBody = {
  rating?: number;
  content?: string;
};

// ── API Functions ─────────────────────────────────────────────

export function enqueueReceiptOcr(body: EnqueueReceiptOcrBody): Promise<EnqueueReceiptOcrResponse> {
  return api.post('ocr/receipt', { json: body }).json<EnqueueReceiptOcrResponse>();
}

export function getReceiptOcrStatus(jobId: string): Promise<ReceiptOcrStatusResponse> {
  return api.get(`ocr/status/${jobId}`).json<ReceiptOcrStatusResponse>();
}

export function createReceipt(body: CreateReceiptBody): Promise<CreateReceiptResponse> {
  return api.post('receipts', { json: body }).json<CreateReceiptResponse>();
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
