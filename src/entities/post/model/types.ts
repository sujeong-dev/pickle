import type { PostImage } from '@/shared/api';

export type { PostImage };

export type Post = {
  // ── Swagger GET /posts 응답 필드 ─────────────────────────────
  id: string;
  authorNickname: string;
  authorProfileImage?: string | null;
  createdAt: string;
  productName: string;
  price: number;
  store: string;
  likeCount: number;
  commentCount: number;
  reviewCount: number;
  isMine: boolean;
  // Swagger에 있으나 nullable / 목록 응답에서 optional
  originalPrice?: number | null;
  discountAmount?: number | null;
  thumbnail?: string | null;
  avgRating?: number | null;
  soldOutStatus?: 'normal' | 'warning' | 'sold_out';
  groupInfo?: { count: number; minPrice: number; maxPrice: number } | null;
  branch?: string;
  productId?: string | null;
  productCode?: string | null;

  // ── TODO: Swagger 미존재 또는 목록 응답 미포함 — 백엔드 확인 필요 ──
  description?: string | null; // 목록 응답에 없음 (상세 응답 `description` 필드)
  discountRate?: number;        // 목록 응답에 없음 (UI에서 price/originalPrice로 계산)
  isLiked?: boolean;            // 목록 응답 미포함
  isBookmarked?: boolean;       // 목록 응답 미포함
  isVerified?: boolean;         // Swagger 전체 미존재
};

export type PostDetail = {
  // ── 목록(Post)과 공통 필드 ─────────────────────────────────
  id: string;
  authorNickname: string;
  authorProfileImage?: string | null;
  createdAt: string;
  productName: string;
  price: number;
  store: string;
  likeCount: number;
  commentCount: number;
  reviewCount: number;
  isMine: boolean;
  branch?: string;
  productId?: string | null;
  productCode?: string | null;
  originalPrice?: number | null;
  discountAmount?: number | null;
  avgRating?: number | null;
  soldOutStatus?: 'normal' | 'warning' | 'sold_out';

  // ── 상세 응답 전용 (Swagger required) ──────────────────────
  images: PostImage[];
  isLiked: boolean;
  isBookmarked: boolean;
  expiredAt: string;
  soldOutCount: number;

  // ── 상세 응답 전용 (Swagger nullable optional) ─────────────
  description?: string | null;
  discountStartAt?: string | null;
  discountEndAt?: string | null;

  // ── TODO: Swagger 미존재 ───────────────────────────────────
  discountRate?: number;
  isVerified?: boolean;
};

export type ReceiptReviewItem = {
  imageUrl?: string;
  rating: number;
};

export type ReceiptReview = {
  id: string;
  rating: number;
  createdAt: string;
  itemCount: number;
  totalAmount: number;
  items: ReceiptReviewItem[];
};
