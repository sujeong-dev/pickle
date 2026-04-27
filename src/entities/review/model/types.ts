import type { PostImage } from '@/shared/api';

export type Review = {
  id: string;
  authorNickname: string;
  authorProfileImage?: string | null;
  createdAt: string;
  content?: string;
  productName: string;
  rating: number;
  price?: number;
  images?: PostImage[];
  // TODO: Swagger 미존재 — 백엔드 확인 필요
  likeCount?: number;
  commentCount?: number;
};
