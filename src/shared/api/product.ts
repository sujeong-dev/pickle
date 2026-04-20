import { api } from './kyInstance';
import type { Post } from '@/entities/post';

// ── Types ────────────────────────────────────────────────────

// Post, Review 이미지 배열의 공통 타입
export type PostImage = {
  id: string;
  url: string;
  orderNum: number;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  authorNickname: string;
  isMine: boolean;
};

export type PostListParams = {
  limit?: number;
  cursor?: string;
  productId?: string;
};

export type PostListResponse = {
  items: Post[];
  limit: number;
  hasNext: boolean;
  nextCursor: string | null;
};

export type LikeResponse = {
  postId: string;
  isLiked: boolean;
  // TODO: Swagger 미존재 — 백엔드 확인 필요 (현재 UI에서 likeCount 표시에 사용)
  likeCount?: number;
};

export type BookmarkResponse = {
  postId: string;
  isBookmarked: boolean;
};

export type CommentListResponse = {
  items: Comment[];
  limit: number;
  hasNext: boolean;
  nextCursor: string | null;
};

// ── API functions ────────────────────────────────────────────

export function getPosts(params?: PostListParams): Promise<PostListResponse> {
  return api.get('posts', { searchParams: params as Record<string, string | number> }).json<PostListResponse>();
}

export function getPostDetail(id: string): Promise<Post> {
  return api.get(`posts/${id}`).json<Post>();
}

export function togglePostLike(postId: string): Promise<LikeResponse> {
  return api.post(`posts/${postId}/like`).json<LikeResponse>();
}

export function togglePostBookmark(postId: string): Promise<BookmarkResponse> {
  return api.post(`posts/${postId}/bookmark`).json<BookmarkResponse>();
}

export function reportPostSoldout(postId: string): Promise<void> {
  return api.post(`posts/${postId}/sold-out`).json<void>();
}

export function getPostComments(postId: string): Promise<CommentListResponse> {
  return api.get(`posts/${postId}/comments`).json<CommentListResponse>();
}

export function createPostComment(postId: string, content: string): Promise<Comment> {
  return api.post(`posts/${postId}/comments`, { json: { content } }).json<Comment>();
}

export function deletePostComment(postId: string, commentId: string): Promise<void> {
  return api.delete(`posts/${postId}/comments/${commentId}`).json<void>();
}

export function getRelatedPosts(productId: string): Promise<PostListResponse> {
  return api.get('posts', { searchParams: { productId } }).json<PostListResponse>();
}
