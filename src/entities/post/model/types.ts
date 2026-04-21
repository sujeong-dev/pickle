import type { PostImage } from '@/shared/api';

export type { PostImage };

export type Post = {
  // ── Swagger GET /posts 응답 필드 ─────────────────────────────
  id: string;
  authorNickname: string;
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
  content?: string;       // 목록 응답에 없음 (상세 응답에 존재할 것)
  discountRate?: number;  // 목록 응답에 없음 (UI에서 price/originalPrice로 계산)
  images?: PostImage[];   // 목록에 없음, thumbnail로 대체. 상세에 있을 것
  rating?: number;        // avgRating으로 대체됨 (레거시 대응용)
  isLiked?: boolean;      // 목록 응답 미포함, 상세 응답 확인 필요
  isBookmarked?: boolean; // 목록 응답 미포함, 상세 응답 확인 필요
  isVerified?: boolean;   // Swagger 전체 미존재
  avatarUrl?: string;     // Swagger 전체 미존재
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
