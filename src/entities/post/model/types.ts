import type { PostImage } from '@/shared/api';

export type { PostImage };

export type Post = {
  id: string;
  authorNickname: string;
  createdAt: string;
  content: string;
  productName: string;
  price: number;
  originalPrice: number;
  discountRate: number;
  store: string;
  branch?: string;
  images: PostImage[];
  reviewCount: number;
  rating: number;
  likeCount: number;
  commentCount: number;
  // TODO: Swagger 미존재 — 백엔드 확인 필요
  isVerified?: boolean;
  avatarUrl?: string;
  relatedPostCount?: number;
  // Swagger 존재
  isLiked?: boolean;
  isBookmarked?: boolean;
  isMine?: boolean;
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
